import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer memory storage (stores in memory instead of writing to disk)
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
    }
}); // adjust if you're uploading multiple / single

// Compression + save middleware
const handleUploadAndCompress = async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) return next();
  
      const uploadDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
  
      const processedFiles = [];
  
      for (const file of req.files) {
        const originalName = file.originalname.split(".")[0];
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `${originalName}-${uniqueSuffix}.jpeg`;
        const outputPath = path.join(uploadDir, filename);
  
        await sharp(file.buffer)
          .resize(800)
          .jpeg({ quality: 80 })
          .toFile(outputPath);
  
        processedFiles.push({
          ...file,
          filename,
          path: outputPath,
        });
      }
  
      // Override req.files with processed files
      req.files = processedFiles;
      next();
    } catch (err) {
      console.error("Image compression failed:", err);
      res.status(500).send("Failed to process images.");
    }
  };
  

export { upload, handleUploadAndCompress };
