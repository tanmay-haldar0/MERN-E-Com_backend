// cloudinary.js
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config( {path: './backend/config/.env',}); 


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);
// console.log("NODE_ENV:", process.env.NODE_ENV); // Should print 'PRODUCTION' or your current environment
// console.log("Path being used:", process.env.NODE_ENV === 'PRODUCTION' ? './backend/config/.env' : '.env');


export default cloudinary;
