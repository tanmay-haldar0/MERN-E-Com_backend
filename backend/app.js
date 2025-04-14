import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import ErrorHandler from "./utils/ErrorHandler.js";
import user from "./controller/user_controller.js";
import seller from "./controller/seller_controller.js";
import product from "./controller/product_controller.js";

const app = express();

// Set __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "./backend/config/.env",
  });
}

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

// Static file serving for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/v2/user", user);
app.use("/api/v2/seller", seller);
app.use("/api/v2/product", product);

// Global Error Handler
app.use((err, req, res, next) => {
  let handler;
  
  if (err instanceof ErrorHandler) {
    // If the error is an instance of ErrorHandler
    handler = err;
  } else {
    // If it's a generic error, create an instance of ErrorHandler
    handler = new ErrorHandler(err.message || "Server Error", err.statusCode || 500);
  }

  res.status(handler.statusCode).json({
    success: false,
    message: handler.message,
  });
});

export default app;
 