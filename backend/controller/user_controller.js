import express from "express";
import path from "path";
import User from "../model/user.js";
import upload from "../multer.js";
import errorHandler from "../utils/errorHandler.js";

const router = express.Router();

router.post("/create-user", upload.single("file"), async (req, res, next) => {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
        return next(new errorHandler("User already exists", 400));
    }

    // const filename = req.file.filename;
    // const fileUrl = path.join(filename);
    const user = {
        name: name,
        email: email,
        password: password,
        // avatar: {
        //     public_id: filename, // Set public_id to the filename
        //     url: fileUrl, // Set url to the file path
        // },

    };

    const newUser = await User.create(user);
    res.status(201).json({
        status: "success",
        newUser,
    });
});

export default router;
