import express from "express";
import path from "path";
import User from "../model/user.js";
import upload from "../multer.js";
import errorHandler from "../utils/errorHandler.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new errorHandler("User already exists", 400));
    }

    const user = {
      name: name,
      email: email,
      password: password,
    };

    console.log(user);

    const activationToken = createActivationToken(user);
    const activationUrl= `http://localhost:5173/activation/${activationToken}`;

    console.log("Activation URL generated:", activationUrl);


    try {
        await sendMail({
            email:user.email,
            subject: 'Activation your Account on ClassiCustom',
            message: `Hello ${user.name}. Please click on this link to activate your account: ${activationUrl} `,

        });
        res.status(200).json({
            success:true,
            message:`email send successfully. Please check your mail ${user.email} to activate your account.`
        })
    } catch (error) {
        return next(new errorHandler(error.message, 500));
    }
    
  } catch (error) {
    return next(new errorHandler(error.message), 400);
  }
});

const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",

    })
}

export default router;
