
import cloudinary from "../cloudinary.config.js";


//file upload

export const uploadToCloudinary = async (
  file: string, // base64 or file path (file to upload)
  folder = 'uploads' // folder name where file will ve stored  on cloudinary
): Promise<{ url: string; public_id: string }> => {
  try {

    //to upload file with the specified folder
    const result = await cloudinary.uploader.upload(file, {
      folder
    });


    return {
      //this return url (to access the uploaded file ) 
      //and public_id as unique identifier of the file
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {

    //error if upload fails
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