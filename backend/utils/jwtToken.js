const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    // Options for Cookies
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION", // Secure flag should be true only in production
        sameSite: "None", // Allow cross-site cookie sharing
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};
