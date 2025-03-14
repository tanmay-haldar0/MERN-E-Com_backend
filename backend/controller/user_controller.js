import express from "express";
import path from "path";
import User from "../model/user.js";
import upload from "../multer.js";
import ErrorHandler from "../utils/errorHandler.js";

import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import sendToken from "../utils/jwtToken.js";
import isAuthenticated from "../middleware/auth.js";

const router = express.Router();

// SignUp User
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      res.status(201).json({
        status: "fail",
        message: "User already exists",
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = {
      name: name,
      email: email,
      password: password,
    };

    console.log(user);

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    console.log("Received request to activate user:", user.email);
    console.log("Activation URL generated:", activationUrl);

    try {
      await sendMail({
        email: user.email,
        subject: "Activation your Account on ClassiCustom",
        message: `Hello ${user.name}. Please click on this link to activate your account: ${activationUrl} `,
      });
      res.status(200).json({
        success: true,
        message: `Please check your mail ${user.email} to activate your account.`,
      });
    } catch (error) {
      return next(new errorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new errorHandler(error.message), 400);
  }
});

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "6h",
  });
};

// Activate the User
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    const { activationToken } = req.body;

    try {
      const decodedUser = jwt.verify(
        activationToken,
        process.env.ACTIVATION_SECRET
      );

      if (!decodedUser) {
        return next(new ErrorHandler("Invalid Token", 400));
      }

      const { name, email, password } = decodedUser;

      let existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "User is already Activated",
        });
        return next(new ErrorHandler("User already activated.", 400));
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      sendToken(user, 201, res);

      res.status(201).json({
        success: true,
        message: "Your account has been activated successfully.",
      });
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(400).json({
        success: false,
        message: "Token verification failed: " + error.message,
      });
    }
  })
);

// Login the User
router.post(
  "/login",
  catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        res.status(400).json({
          message: "Please enter all the fields",
          success: false,
        });
        return next(new ErrorHandler("Please Fill all the fields.", 400));
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found. Please SignUp",
        });
        return next(new ErrorHandler("User does not exist. Please SignUp", 401));
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid password",
        });
        return next(new ErrorHandler("Invalid Password", 401));
      }
      const userData = user._doc; // Store user data
      delete userData.password; // Exclude password

      res.status(200).json({
        success: true,
        user: userData, // Send user data without password
        token: sendToken(user, 200, res) // Send token along with user data
      });

    } catch (error) {
      console.log(error);
      res.status(500).json(new ErrorHandler(error.message, 500).formatResponse());
    }
  })
);

router.get("/get-user", isAuthenticated, catchAsyncError(async (req, res, next) => {
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
}));

export default router;
