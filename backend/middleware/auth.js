// import errorHandler from "../utils/errorHandler.js";
// import cacheAsyncError from "./cacheAsyncError.js"
import jwt from "jsonwebtoken";
import catchAsyncError from "./cacheAsyncError.js";
import User from "../model/user.js";
import Seller from "../model/seller.js";


export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ error: "Please login to access this resource" });
  }

  const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedUser.id);
  next();
});

export const isSellerAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.seller_token;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Please login to access this resource" });
  }

  const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await Seller.findById(decodedUser.id);
  next();
});
