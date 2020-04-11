const jwt = require('jsonwebtoken')
const AsyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

exports.protect = AsyncHandler(async (req, res, next) => {
  let token
  // the if part is setting token in the Bearer that means in the header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }// This else if part is used to set the token in the cookies 
  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  // To ensure that the token exists
  if (!token) {
    return next(new ErrorResponse('Not authorised to access this route', 401))
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    req.user = await User.findById(decoded.id)
    next()
  } catch (err) {
    return next(
      new ErrorResponse('Not authorised to access this route', 401)
    )
  }
})
// Grant the access to specific users
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authoried to access this route`, 403))
    }
    next()
  }
}
