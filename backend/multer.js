import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

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
    if (!req.files || req.files.length === 0) return next();

    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const processedFiles = [];

    for (const file of req.files) {
      const formattedDateTime = getFormattedDateTime();
      const randomId = Math.round(Math.random() * 1e6);
      const filename = `img_${formattedDateTime}_${randomId}.jpeg`;
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

    req.files = processedFiles;
    next();
  } catch (err) {
    console.error("Image compression failed:", err);
    res.status(500).send("Failed to process images.");
  }
};
 
export { upload, handleUploadAndCompress };
