// Create Token and Save it in the Cookies

const sendToken = (user, statusCode, res)=>{
    const token = user.getJwtToken();

    // Options for Cookies

    const options = {

        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        token,
    })
}

export default sendToken;
