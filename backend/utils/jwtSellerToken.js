// Create Token and Save it in the Cookies

const sendSellerToken = (user, statusCode, res)=>{
    const token = user.getJwtToken();

    // Options for Cookies

    const options = {

        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie("seller_token",token,options).json({
        success:true,
        user,
        token,
    })
}

export default sendSellerToken;
