import express from "express";
import path from "path";
import User from "../model/user.js";
import {upload} from "../multer.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import sendToken from "../utils/jwtToken.js";
import {isAuthenticated} from "../middleware/auth.js";

const router = express.Router();

// SignUp User
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = { name, email, password };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    console.log("Received request to activate user:", user.email);
    console.log("Activation URL generated:", activationUrl);

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your Account on ClassiCustom",
        message: `Hello ${user.name}, click this link to activate your account: ${activationUrl}`,
      });

      return res.status(200).json({
        success: true,
        message: `Check your email ${user.email} to activate your account.`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "6h" });
};

// Activate the User
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    const { activationToken } = req.body;

    try {
      const decodedUser = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
      if (!decodedUser) {
        return next(new ErrorHandler("Invalid Token", 400));
      }

      const { name, email, password } = decodedUser;

      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User is already activated",
        });
      }

      const user = await User.create({ name, email, password });

      sendToken(user, 201, res); // Ensuring this sends only one response
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(400).json({
        success: false,
        message: "Token verification failed: " + error.message,
      });
    }
  })
);

// Login User
router.post(
  "/login",
  catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const userData = user.toObject();
    delete userData.password; // Exclude password before sending response

    sendToken(user, 200, res);
  })
);

// Get Logged-In User
router.get(
  "/get-user",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // Exclude password
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

export default router;
