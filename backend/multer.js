import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cloudinary from "./clouninary.js";
import streamifier from "streamifier"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Helper to format date and time
function getFormattedDateTime() {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now
    .toTimeString()
    .split(" ")[0]
    .replace(/:/g, "-"); // HH-MM-SS
  return `${date}_${time}`;
}

// Middleware to compress and rename files
const handleUploadAndCompress = async (req, res, next) => {
  try {
    // Normalize files input: always work with an array
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) return next();

    const uploadedFiles = [];

    for (const file of files) {
      // Compress with sharp
      const compressedBuffer = await sharp(file.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload to Cloudinary using stream
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "your_folder", // Optional: cloudinary folder
              format: "jpeg",
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(compressedBuffer).pipe(stream);
        });

      const result = await streamUpload();

      uploadedFiles.push({
        ...file,
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    // Assign results back to request
    if (req.file) {
      req.file = uploadedFiles[0];
    } else {
      req.files = uploadedFiles;
    }

    next();
  } catch (err) {
    console.error("Image upload failed:", err);
    res.status(500).send("Failed to upload images.");
  }
};
 
export { upload, handleUploadAndCompress };
