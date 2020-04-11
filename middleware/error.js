const ErrorResponse = require('../utils/errorResponse')
const ErrorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  // Log to the developer
  console.log(err)

  // Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = `Resources not found `
    error = new ErrorResponse(message, 404)
  }

  // Mongoose Duplicate Key error
  if (err.code === 11000) {
    const message = 'Duplicate Field value Entered'
    error = new ErrorResponse(message, 400)
  }
  // Mongoose Validation Error
  // if (err.name === 'ValidationError') {
  //   const message = Object.keys(err.errors).maps((val) => val.message)
  //   error = new ErrorResponse(message, 400);
  // }
  // this here is getting returned to the corresponding error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}
module.exports = ErrorHandler
