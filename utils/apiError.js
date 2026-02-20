// we handle the error here by taking status code and cause of error

class ApiError extends Error {
    // we pass this to Error class which have these arguments
    constructor(statusCode, message, isOperational = true, stack = '') {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
const apiErrorInstance = new ApiError();
export {apiErrorInstance}