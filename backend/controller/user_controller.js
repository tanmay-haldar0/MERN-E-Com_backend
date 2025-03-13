import express from "express";
import path from "path";
import User from "../model/user.js";
import upload from "../multer.js";
import errorHandler from "../utils/errorHandler.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import sendToken from "../utils/jwtToken.js";

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
      return next(new errorHandler("User already exists", 400));
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

    // console.log("Received activation token:", activationToken);

    // Verify the token
    try {
      const decodedUser = jwt.verify(
        activationToken,
        process.env.ACTIVATION_SECRET
      );

      // console.log("Decoded user from token:", decodedUser);

      if (!decodedUser) {
        return next(new errorHandler("Invalid Token", 400));
      }

      // Destructure user data
      const { name, email, password } = decodedUser;

      // Check if user already exists (to avoid re-activation)
      // console.log("Checking if user already exists for activation:", email);

      let existingUser = await User.findOne({ email });
      if (existingUser) {
        // console.log("user already activated: ", existingUser);
        res.status(400).json({
          success: false,
          message: "User is already Activated",
        });
        return next(new errorHandler("User already activated.", 400));
      }

      // Create the user in the database
      const user = await User.create({
        name,
        email,
        password,
      });

      // Generate token and send response
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
        return next(new errorHandler("Please Fill all the feilds.", 400));
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(
          new errorHandler("User does not exist. Please SignUp", 401)
        );
      }
      const isPasswordValid = await user.conparePassword(password);
      if (!isPasswordValid) {
      return next(new errorHandler("Invalid Password", 401));
      }
      sendToken(user, 200, res);
    } catch (error) {
      return next(new errorHandler(error.message, 500));
    }
  })
);
export default router;
