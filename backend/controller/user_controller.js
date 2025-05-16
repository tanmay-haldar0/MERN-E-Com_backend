import express from "express";
import path from "path";
import User from "../model/user.js";
import { upload } from "../multer.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import sendToken from "../utils/jwtToken.js";
import { isAuthenticated } from "../middleware/auth.js";
import admin from "../utils/firebaseAdmin.js";

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
    const activationUrl = `https://classiccustom-frontend.onrender.com/activation/${activationToken}`;

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

// Logout User
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
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


// Get all user (admin)
router.get(
  "/admin-user",
  catchAsyncError(async (req, res) => {
    const user = await User.find()
      .sort({ createdAt: -1 })
      .select("name email _id"); // Only select needed fields

    const formattedUser = user.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
    }));

    res.status(200).json({ success: true, users: formattedUser });
  })
);

// forgot password


router.post(
  "/forgot-password",
  catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET, {
      expiresIn: "15m",
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordTime = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `https://classiccustom-frontend.onrender.com/reset-password/${resetToken}`;

    await sendMail({
      email: user.email,
      subject: "Reset Your Password",
      message: `Click the following link to reset your password: ${resetUrl}`,
    });

    res.status(200).json({
      success: true,
      message: `Reset link sent to ${email}`,
    });
  })
);

// Reset Password

router.post(
  "/reset-password",
  catchAsyncError(async (req, res, next) => {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
      const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        resetPasswordTime: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired token" });
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordTime = undefined;
      await user.save();

      res.status(200).json({ success: true, message: "Password has been reset" });
    } catch (err) {
      return res.status(400).json({ success: false, message: "Token error: " + err.message });
    }
  })
);


// Google Login
router.post("/google-auth", async (req, res) => {
  const { idToken } = req.body;

  try {
    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    // ✅ Verify the ID token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    let { name, email, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Email is required in token" });
    }

    if(name){
      name = toTitleCase(name);
    }
    // 🔎 Check if the user exists in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // 👤 Create a new user if not found
      user = await User.create({
        name,
        email,
        avatar: { url: picture }, // 👈 nested properly
        // password: null,
        provider: "google",
      });

    }

    sendToken(user, 200, res);

  } catch (err) {
    console.error("Google auth failed:", err);
    return res.status(401).json({ message: "Invalid or expired Google token" });
  }
});

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default router;

