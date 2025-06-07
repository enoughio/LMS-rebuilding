
import cloudinary from "../cloudinary.config.js";


//file upload

export const uploadToCloudinary = async (
  file: string, // base64 or file path
  folder = 'uploads'
): Promise<{ url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    throw new Error('Cloudinary upload failed: ' + err);
  }
};


//file delete

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    throw new Error('Cloudinary delete failed: ' + err);
  }
};