import { Types } from "mongoose";
import prisma from "../lib/prisma.js";
import { SeatName } from "../../generated/prisma/index.js";
export async function createSeatType(req, res) {
    try {
        // verify admin creds later
        // lib admin, 
        // libraryId,
        const { libraryId, Type, description, pricePerHour, amenities, color } = req.body;
        if (!libraryId || !Type || !pricePerHour || !amenities || !description || !color) {
            res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Missing required fields',
            });
            return;
        }
        // libId is a mongoDB ObjectId, so we need to check if it's a valid ObjectId
        if (!Types.ObjectId.isValid(libraryId) ||
            !(Object.values(SeatName).includes(Type)) ||
            typeof description !== 'string' ||
            typeof pricePerHour !== 'number' ||
            !Array.isArray(amenities) ||
            typeof color !== 'string') {
            res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Invalid data types for one or more fields',
                data: null,
            });
            return;
        }
        //check if library exists
        const libraryExists = await prisma.library.findUnique({
            where: {
                id: libraryId,
            },
        });
        if (!libraryExists) {
            res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Library not found',
            });
            return;
        }
        const result = await prisma.seatType.create({
            data: {
                libraryId: libraryId,
                name: Type,
                description: description,
                amenities: amenities,
                pricePerHour: pricePerHour,
                color: color,
                isActive: true,
            }
        });
        res.status(201).json({
            success: true,
            message: 'Seat type created successfully',
            data: result,
        });
    }
    catch (error) {
        console.error('Error creating seat type:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'An error occurred while creating the seat type',
            data: null
        });
    }
}
export async function updateSeatType(req, res) {
    try {
        const { id } = req.params;
        const { Type, description, pricePerHour, amenities, color } = req.body;
        if (!id || !Type || !pricePerHour || !amenities || !description || !color) {
            res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Missing required fields',
            });
            return;
        }
        // Validate the ID format
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Invalid seat type ID format',
            });
            return;
        }
        // Check if the seat type exists
        const seatTypeExists = await prisma.seatType.findUnique({
            where: { id },
        });
        if (!seatTypeExists) {
            res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Seat type not found',
            });
            return;
        }
        // // Check if the seat type belongs to the admin's library
        // if (seatTypeExists.libraryId !== req?.user?.libraryId) {
        //     res.status(403).json({
        //         success: false,
        //         error: 'Forbidden',
        //         message: 'This seat type does not belong to your library',
        //     });
        //     return;
        // }        // Update the seat type
        const updatedSeatType = await prisma.seatType.update({
            where: { id },
            data: {
                name: Type,
                description: description,
                amenities: amenities,
                pricePerHour,
                color,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Seat type updated successfully',
            data: updatedSeatType,
        });
    }
    catch (error) {
        console.error('Error updating seat type:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'An error occurred while updating the seat type',
        });
    }
}
export async function deleteSeatType(req, res) {
    try {
        // verify admin creds later
        // lib admin,
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Missing seat type ID',
            });
            return;
        }
        // Validate the ID format
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Invalid seat type ID format',
            });
            return;
        }
        const seatTypeExists = await prisma.seatType.findUnique({
            where: { id },
        });
        if (!seatTypeExists) {
            res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Seat type not found',
            });
            return;
        }
        // check if the seat type belongs to the admin's library
        // if( seatTypeExists.libraryId != req?.user?.libraryId)
        // {
        //     res.status(403).json({
        //         success: false,
        //         error: 'Forbidden',
        //         message: 'this seat type does not belong to your library',
        //     });
        //     return;
        // }
        // Delete the seat type
        await prisma.seatType.update({
            where: { id },
            data: {
                isActive: false, // Soft delete
            },
        });
        res.status(200).json({
            success: true,
            message: 'Seat type deActivated successfully',
        });
    }
    catch (error) {
        console.error('Error deleting seat type:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'An error occurred while deleting the seat type',
        });
    }
}
export async function getSeatTypes(req, res) {
    try {
        const { libraryId } = req.params;
        if (!libraryId || typeof libraryId !== 'string') {
            res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Missing libraryId',
            });
            return;
        }
        // Validate the libraryId format
        if (!Types.ObjectId.isValid(libraryId)) {
            res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Invalid libraryId format',
            });
            return;
        }
        // Check if the library exists
        const libraryExists = await prisma.library.findUnique({
            where: { id: libraryId },
        });
        if (!libraryExists) {
            res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Library not found',
            });
            return;
        } // Fetch seat types for the library with seat counts
        const seatTypes = await prisma.seatType.findMany({
            where: {
                libraryId: libraryId,
                isActive: true, // Only fetch active seat types
            },
            include: {
                seats: {
                    where: {
                        isActive: true, // Only count active seats
                    },
                    select: {
                        id: true,
                        isAvailable: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc', // Order by creation date
            },
        });
        // Transform the data to include seat counts
        const seatTypesWithCounts = seatTypes.map((seatType) => {
            const totalSeats = seatType.seats.length;
            const availableSeats = seatType.seats.filter(seat => seat.isAvailable).length;
            const { seats, ...seatTypeData } = seatType;
            return {
                ...seatTypeData,
                totalSeats,
                availableSeats,
                occupiedSeats: totalSeats - availableSeats,
            };
        });
        res.status(200).json({
            success: true,
            message: 'Seat types fetched successfully',
            data: seatTypesWithCounts,
        });
    }
    catch (error) {
        console.error('Error fetching seat types:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'An error occurred while fetching seat types',
        });
    }
}
//# sourceMappingURL=seatTypeController.js.map