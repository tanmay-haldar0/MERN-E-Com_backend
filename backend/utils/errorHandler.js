class ErrorHandler extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;

    Error.captureStackTrace(this, this.constructor);
  }

  // Method to format the error response
  formatResponse() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statuscode,
    };
  }
}

export default ErrorHandler;
