import multer from 'multer';

// Configure multer for memory storage (since we'll upload to Cloudinary directly)
const storage = multer.memoryStorage();

// File filter to validate image types
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer with memory storage and file validation
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 5MB limit
  },
});

// Export specific middleware for different use cases
export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 10) => upload.array(fieldName, maxCount);
