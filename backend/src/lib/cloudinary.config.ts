import { v2 as cloudinary } from 'cloudinary'
require("dotenv").config()
cloudinary.config({
  cloud_name: 'dbuqitn5w',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;