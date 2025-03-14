
import errorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // MongoDb Id not found error
  const handler = new errorHandler();
 

  if (err.name == "CastError") {
    const message = `Resources not found with this id.. invalid ${err.path}`;
    err = new errorHandler(message, 400);
  }

  // Duplicate Error
  if (err.code == 11000) {
    const message = `Duplicate Value ${Object.keys(err.keyValue)} Entered`;
    err = new errorHandler(message, 400);
  }

  // jwt error
  if (err.name == "JsonWebTokenError") {
    const message = "Your url is invalid please try again later";
    err = new errorHandler(message, 400);
  }

  // jwt expired error
  if (err.name == "TokenExpiredError") {
    const message = "Your url expired please try again later";
    err = new errorHandler(message, 400);
  }

  res.status(err.statusCode).json(err.formatResponse());

};
