class ErrorResponse extends Error {
  constructor (message, statusCode) {
    super(message);
    this.statusCode = statusCode
  }
}
module.exports = ErrorResponse
// This is Files is used to for Using the Mongoose Error Handling class