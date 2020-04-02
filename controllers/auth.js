const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const AsyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
// ---------------------------
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
  sendTokenResponse(user, 200, res)

//   // CREATE TOKEN
//   const token = user.getSignedJwtToken()
//   res.status(200).json({ success: true, token: token })
})
// ---------------------------------------------------------------
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
  sendTokenResponse(user, 200, res)
//   const token = user.getSignedJwtToken()
//   res.status(200).json({ success: true, token: token })
})
// -----------------------------------------------------------------------

// @ desc Get the current logged in user
// @route Post/api/v1/auth/me
exports.getMe = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    data: user
  })
})

// @ desc Forgot the Password
// @route Post/api/v1/auth/forgotPassword
// @access Public
exports.forgotPassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new ErrorResponse('There is no user in the email that has been enters Sorry!!', 404))
  }
  // Get the reset token
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })
  // create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`
  const message = `You are recieving this email because you(or someone else) has requestd
  the reset of a password.Please make a PUT request to:\n\n ${resetUrl}`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset Token',
      message
    })
    res.status(200).json({ success: true, data: 'Email.sent' })
  } catch (Err) {
    console.log(Err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })
    return next(new ErrorResponse('Email could not be sent', 500))
  }
  res.status(200).json({
    success: true,
    data: user
  })
})
// @ desc ResetPassword
// @route PUT/api/v1/auth/resetPassword/:resetToken
exports.resetPassword = AsyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
  if (!user) {
    return next(
      new ErrorResponse('Invalid Token', 400)
    )
  }
  // set  new Password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save() 
  sendTokenResponse(user, 200, res);
})
// Get token and cookie and send the response as it has been used in the
// different routes successfully
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if (process.env.NODE_ENV == 'production') {
    options.secure = true
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    })
}
