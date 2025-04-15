const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
  
    const isProduction = process.env.NODE_ENV === "PRODUCTION";
  
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: isProduction,              // cookies only sent over HTTPS
      sameSite: isProduction ? "None" : "Lax", // allows cross-origin cookies
    };
  
    res.status(statusCode)
      .cookie("token", token, options)
      .json({
        success: true,
        user,
        token,
      });
  };
  
  export default sendToken;
  