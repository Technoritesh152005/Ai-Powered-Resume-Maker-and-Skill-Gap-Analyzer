class ApiResponse {
    // whenever instance is used this constructor will get automatically called
    constructor(statusCode, data, message = 'Success') {
      this.statusCode = statusCode;
      this.success = statusCode >= 200 && statusCode < 300;
      this.message = message;
      this.data = data;
    }
  }
  
const apiResponseInstance = new ApiResponse()
export {apiResponseInstance}