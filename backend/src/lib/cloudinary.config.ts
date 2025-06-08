// Import the Cloudinary v2 API as 'cloudinary'


import { v2 as cloudinary } from 'cloudinary'
//version-2 of cloudinary sdk



// Configure Cloudinary

cloudinary.config({
  cloud_name: 'dbuqitn5w', //cloud name which is account identifier
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); 

export default cloudinary;