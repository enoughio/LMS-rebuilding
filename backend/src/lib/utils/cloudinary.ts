
import cloudinary from "../cloudinary.config.js";


//file upload

export const uploadToCloudinary = async (
  file: string | Buffer, // base64, file path, or buffer (file to upload)
  folder = 'uploads' // folder name where file will be stored on cloudinary
): Promise<{ url: string; public_id: string }> => {
  try {
    let uploadResult;

    if (Buffer.isBuffer(file)) {
      // Handle buffer (from multer)
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            folder,
            resource_type: 'auto', // auto-detect file type
            quality: 'auto', // auto-optimize quality
            fetch_format: 'auto' // auto-optimize format
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file);
      });
    } else {
      // Handle string (base64 or file path)
      uploadResult = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
      });
    }

    const result = uploadResult as any;
    return {
      // this returns url (to access the uploaded file) 
      // and public_id as unique identifier of the file
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    // error if upload fails
    console.error('Cloudinary upload error:', err);
    throw new Error('Cloudinary upload failed: ' + err);
  }
};


//file delete

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    //use the unique identifier of file as public_id from cloudinary
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    throw new Error('Cloudinary delete failed: ' + err);
  }
};