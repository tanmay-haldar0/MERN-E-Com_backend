// routes/admin.js
import express from "express";
import sendToken  from "../utils/jwtToken.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import User from "../model/user.js";
import { isAdminOnly } from "../middleware/auth.js";

const router = express.Router();

// POST /api/admin/login
router.post(
  "/login",
  catchAsyncError(async (req, res) => {
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
        message: "Admin not found. Please check your credentials.",
      });
    }

    // Check for admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not an admin.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Remove password from returned object
    const userData = user.toObject();
    delete userData.password;

    sendToken(user, 200, res); // Assumes this adds a token to response
  })
);


// get admin

router.get(
  "/get-admin",
  isAdminOnly,
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
