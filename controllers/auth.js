const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const AsyncHandler = require('../middleware/async')

// @desc Register user
// @route GET/api/v1/auth/register
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
