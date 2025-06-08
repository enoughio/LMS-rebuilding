import { uploadToCloudinary, deleteFromCloudinary } from '../lib/utils/cloudinary.js';
// Upload image to Cloudinary
export const uploadImage = async (req, res) => {
    try {
        const { image, folder = 'uploads' } = req.body;
        if (!image) {
            res.status(400).json({
                success: false,
                message: 'Image data is required'
            });
            return;
        }
        // Validate base64 format
        if (!image.startsWith('data:image/')) {
            res.status(400).json({
                success: false,
                message: 'Invalid image format. Please provide a valid base64 image.'
            });
            return;
        }
        // Upload to Cloudinary
        const result = await uploadToCloudinary(image, folder);
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: result.url,
                publicId: result.public_id
            }
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
// Delete image from Cloudinary
export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.body;
        if (!publicId) {
            res.status(400).json({
                success: false,
                message: 'Public ID is required'
            });
            return;
        }
        // Delete from Cloudinary
        await deleteFromCloudinary(publicId);
        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Image deletion failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
//# sourceMappingURL=uploadController.js.map