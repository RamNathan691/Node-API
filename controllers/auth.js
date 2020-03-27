const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const AsyncHandler = require('../middleware/async')

// @desc Register user
// @route POST/api/v1/auth/register
// @access Public
exports.register = AsyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  // create user
  const user = await User.create({
    name,
    email,
    password,
    role
  })
  // CREATE TOKEN
  const token = user.getSignedJwtToken()
  res.status(200).json({ success: true, token: token })
})
// @desc Login user
// @route POST/api/v1/auth/login
// @access Public
exports.login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  // Valid email and the password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email', 400))
  }
  // Check for user
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(new ErrorResponse('Invalid Login or Password', 401))
  }
  // Check if the password matchs correctly
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse('Invalid Login or Password', 401))
  }
  // CREATE TOKEN
  const token = user.getSignedJwtToken()
  res.status(200).json({ success: true, token: token })
})
