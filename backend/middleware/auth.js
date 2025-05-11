import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Seller from "../model/seller.js";
import catchAsyncError from "./cacheAsyncError.js";

// ✅ For users and admins
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ error: "Please login to access this resource" });
  }

  const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decodedUser.id);

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  req.user = user;
  next();
});

// ✅ For sellers and admins
export const isSellerAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.seller_token;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Please login to access this resource" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Try to find seller
  const seller = await Seller.findById(decoded.id);
  if (seller) {
    req.user = seller;
    return next();
  }

  // Fallback: check if it's an admin using the same token
  const user = await User.findById(decoded.id);
  if (user && user.role === "admin") {
    req.user = user;
    return next();
  }

  return res.status(403).json({ error: "Access denied" });
});

// ✅ Admin-only middleware
export const isAdminOnly = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Please login as admin" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decoded.id);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  req.user = user;
  next();
});
