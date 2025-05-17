import express from "express";
import path from "path";
import Seller from "../model/seller.js";
import {upload} from "../multer.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import sendSellerToken from "../utils/jwtSellerToken.js";
import {isSellerAuthenticated} from "../middleware/auth.js";

const router = express.Router();

// SignUp User
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, shopName, phoneNumber, email, password } = req.body;
    const userEmail = await Seller.findOne({ email });

    if (userEmail) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = { name, shopName, phoneNumber, email, password};

    const activationToken = createActivationToken(user);
    const activationUrl = `${process.env.CLIENT_URL}/seller/activation/${activationToken}`;

    // console.log("Received request to activate user:", user.email);
    // console.log("Activation URL generated:", activationUrl);

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your Seller Account on ClassiCustom",
        message: `Hello ${user.name}, click this link to activate your Seller account: ${activationUrl}`,
      });

      return res.status(200).json({
        success: true,
        message: `Check your email ${user.email} to activate your Seller account.`,
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

      const { name, shopName, phoneNumber, email, password} = decodedUser;

      let existingUser = await Seller.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User is already activated",
        });
      }

      const user = await Seller.create({ name, shopName, phoneNumber, email, password});

      sendSellerToken(user, 201, res); // Ensuring this sends only one response
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

    const user = await Seller.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up.",
      });
    }
    // console.log(user)
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    // console.log(isPasswordValid)
    const userData = user.toObject();
    delete userData.password; // Exclude password before sending response

    sendSellerToken(user, 200, res);
  })
);

// Get Logged-In User
router.get(
  "/get-user",
  isSellerAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await Seller.findById(req.user.id).select("-password"); // Exclude password
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

// Logout User
router.get(
  "/logout",
  isSellerAuthenticated,
  catchAsyncError(async (req, res, next) => {
    res.cookie("seller_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  })
);


// Get all vendor (admin)
router.get(
  "/admin-seller",
  catchAsyncError(async (req, res) => {
    const sellers = await Seller.find()
      .sort({ createdAt: -1 })
      .select("name email _id"); // Only select needed fields

    const formattedSellers = sellers.map((seller) => ({
      id: seller._id,
      name: seller.name,
      email: seller.email,
    }));

    res.status(200).json({ success: true, sellers: formattedSellers });
  })
);



export default router;
