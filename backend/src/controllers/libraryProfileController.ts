import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/utils/cloudinary.js';

// Get library profile for admin
export const getLibraryProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    // Check if user is an admin and get their library
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        adminOf: true
      }
    });

    if (!user || user.role !== 'ADMIN' || !user.adminOf) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User is not a library admin',
      });
      return;
    }

    const libraryId = user.adminOf.id;    // Get library with all related data
    const library = await prisma.library.findUnique({
      where: { id: libraryId },
      include: {
        openingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
        membershipPlans: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            features: true,
            allowedBookingsPerMonth: true,
            eLibraryAccess: true,
          },
        },
        seats: {
          select: {
            isAvailable: true,
            isActive: true,
          },
          where: { isActive: true },
        },
      },
    });

    if (!library) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Library not found',
      });
      return;
    }

    // Calculate available seats
    const availableSeats = library.seats.filter(seat => seat.isAvailable).length;

    // Transform opening hours to match frontend format
    const openingHours: Record<string, { open: string; close: string }> = {};
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    library.openingHours.forEach((hour) => {
      const dayName = dayNames[hour.dayOfWeek];
      openingHours[dayName] = {
        open: hour.isClosed ? 'closed' : hour.openTime,
        close: hour.isClosed ? 'closed' : hour.closeTime,
      };
    });

    // Format response to match frontend expectations
    const response = {
      id: library.id,
      name: library.name,
      description: library.description,
      address: library.address,
      images: library.images || [],
      rating: library.rating || 0,
      reviewCount: library.reviewCount || 0,
      amenities: library.amenities || [],
      openingHours,
      ownerId: library.adminId,
      membershipPlans: library.membershipPlans,
      totalSeats: library.totalSeats,
      availableSeats,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching library profile:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch library profile',
    });
  }
};

// Update library profile for admin
export const updateLibraryProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    // Check if user is an admin and get their library
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        adminOf: true
      }
    });

    if (!user || user.role !== 'ADMIN' || !user.adminOf) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User is not a library admin',
      });
      return;
    }

    const libraryId = user.adminOf.id;    const {
      name,
      description,
      address,
      city,
      state,
      country,
      postalCode,
      email,
      phone,
      amenities,
      totalSeats,
      images,
      openingHours,
      imagesToDelete
    } = req.body;

    // Parse amenities if it's a string
    let parsedAmenities = amenities;
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (error) {
        console.error('Error parsing amenities:', error);
        parsedAmenities = [];
      }
    }

    // Input validation
    if (name && (typeof name !== 'string' || name.trim().length === 0)) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Library name must be a non-empty string',
      });
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid email format',
      });
      return;
    }

    if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid phone number format',
      });
      return;
    }

    // Get current library data for image management
    const currentLibrary = await prisma.library.findUnique({
      where: { id: libraryId },
      select: { images: true }
    });

    if (!currentLibrary) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Library not found',
      });
      return;
    }

    // Start transaction to update library and opening hours
    const updatedLibrary = await prisma.$transaction(async (tx) => {
      let updatedImages = currentLibrary.images || [];

      // Handle image deletions first
      if (imagesToDelete && Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
        try {
          // Delete images from Cloudinary
          const deletePromises = imagesToDelete.map(async (imageUrl: string) => {
            try {
              // Extract public_id from Cloudinary URL
              const urlParts = imageUrl.split('/');
              const publicIdWithExtension = urlParts[urlParts.length - 1];
              const publicId = publicIdWithExtension.split('.')[0];
              const folderPath = urlParts.slice(-2, -1)[0]; // Get folder name
              const fullPublicId = `${folderPath}/${publicId}`;
              
              await deleteFromCloudinary(fullPublicId);
              console.log(`Successfully deleted image: ${fullPublicId}`);
            } catch (deleteError) {
              console.error(`Failed to delete image from Cloudinary: ${imageUrl}`, deleteError);
              // Don't throw error here, continue with other deletions
            }
          });

          await Promise.allSettled(deletePromises);
          
          // Remove deleted images from the array
          updatedImages = updatedImages.filter((img: string) => !imagesToDelete.includes(img));
        } catch (error) {
          console.error('Error deleting images:', error);
          // Continue with the update even if image deletion fails
        }
      }

      // Handle new image uploads
      const files = (req as any).files as Express.Multer.File[];
      if (files && files.length > 0) {
        try {
          // Validate total image count (including existing images)
          const totalImageCount = updatedImages.length + files.length;
          if (totalImageCount > 10) {
            throw new Error(`Total image count (${totalImageCount}) exceeds maximum limit of 10 images`);
          }

          // Upload new images to Cloudinary
          const uploadPromises = files.map(async (file: Express.Multer.File) => {
            try {
              // Validate file size (additional check)
              if (file.size > 5 * 1024 * 1024) {
                throw new Error(`File ${file.originalname} exceeds 5MB size limit`);
              }

              // Validate file type (additional check)
              if (!file.mimetype.startsWith('image/')) {
                throw new Error(`File ${file.originalname} is not a valid image`);
              }

              const result = await uploadToCloudinary(file.buffer, 'library-images');
              console.log(`Successfully uploaded image: ${file.originalname}`);
              return result.url;
            } catch (uploadError) {
              console.error(`Failed to upload image: ${file.originalname}`, uploadError);
              throw uploadError;
            }
          });

          const uploadedImageUrls = await Promise.all(uploadPromises);
          updatedImages = [...updatedImages, ...uploadedImageUrls];
        } catch (error) {
          console.error('Error uploading images:', error);
          throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Handle images passed as URLs (for existing images or base64)
      if (images && Array.isArray(images)) {
        // For new images passed as base64 or URLs
        const base64Images = images.filter((img: string) => 
          typeof img === 'string' && 
          (img.startsWith('data:image/') || (!img.startsWith('http') && img.length > 100))
        );

        if (base64Images.length > 0) {
          try {
            const uploadPromises = base64Images.map(async (base64Image: string) => {
              const result = await uploadToCloudinary(base64Image, 'library-images');
              return result.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            updatedImages = [...updatedImages, ...uploadedUrls];
          } catch (error) {
            console.error('Error uploading base64 images:', error);
            throw new Error(`Base64 image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Keep existing URLs that are not base64
        const existingUrls = images.filter((img: string) => 
          typeof img === 'string' && img.startsWith('http')
        );
        
        if (existingUrls.length > 0) {
          updatedImages = [...new Set([...updatedImages, ...existingUrls])]; // Remove duplicates
        }
      }      // Update library basic information
      const library = await tx.library.update({
        where: { id: libraryId },
        data: {
          ...(name && { name: name.trim() }),
          ...(description && { description: description.trim() }),
          ...(address && { address: address.trim() }),
          ...(city && { city: city.trim() }),
          ...(state && { state: state.trim() }),
          ...(country && { country: country.trim() }),
          ...(postalCode && { postalCode: postalCode.trim() }),
          ...(email && { email: email.trim().toLowerCase() }),
          ...(phone && { phone: phone.trim() }),
          ...(parsedAmenities && { amenities: parsedAmenities }),
          ...(totalSeats && { totalSeats: parseInt(totalSeats) }),
          images: updatedImages,
        },
      });

      // Update opening hours if provided
      if (openingHours && typeof openingHours === 'object') {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        for (const [dayName, hours] of Object.entries(openingHours)) {
          const dayOfWeek = dayNames.indexOf(dayName);
          if (dayOfWeek !== -1 && typeof hours === 'object' && hours !== null) {
            const { open, close } = hours as { open: string; close: string };
            const isClosed = open === 'closed' || close === 'closed' || !open || !close;

            await tx.openingHour.upsert({
              where: {
                libraryId_dayOfWeek: {
                  libraryId,
                  dayOfWeek,
                },
              },
              update: {
                openTime: isClosed ? '00:00' : open,
                closeTime: isClosed ? '00:00' : close,
                isClosed,
              },
              create: {
                libraryId,
                dayOfWeek,
                openTime: isClosed ? '00:00' : open,
                closeTime: isClosed ? '00:00' : close,
                isClosed,
              },
            });
          }
        }
      }

      return library;
    });

    res.status(200).json({
      success: true,
      data: updatedLibrary,
      message: 'Library profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating library profile:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Image upload failed') || 
          error.message.includes('exceeds maximum limit') ||
          error.message.includes('exceeds 5MB size limit') ||
          error.message.includes('not a valid image')) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update library profile',
    });
  }
};
