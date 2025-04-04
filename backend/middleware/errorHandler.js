const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    let error = { ...err };
    error.message = err.message;
  
    // MySQL errors
    if (err.code === 'ER_DUP_ENTRY') {
      const message = 'Duplicate field value entered';
      error = new ErrorResponse(message, 400);
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      const message = 'Not authorized';
      error = new ErrorResponse(message, 401);
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
  
  class ErrorResponse extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  module.exports = errorHandler;