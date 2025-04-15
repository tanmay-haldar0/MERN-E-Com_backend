const sendSellerToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
  
    const isProduction = process.env.NODE_ENV === "PRODUCTION";
  
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: isProduction, // only over HTTPS in production
      sameSite:"None", // must be "None" for cross-origin
    };
  
    res.status(statusCode)
      .cookie("seller_token", token, options)
      .json({
        success: true,
        user,
        token,
      });
  };
  
  export default sendSellerToken;
  