const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const AsyncHandler = require('../middleware/async')


// @desc Get all the user
// @route Get/api/v1/auth/users
// @access Private/Admin
exports.getUsers = AsyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc Get single user
// @route Get/api/v1/auth/users/:id
// @access Private/Admin
exports.getUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc Create user
// @route POST/api/v1/auth/users
// @access Private/Admin
exports.createUser = AsyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc Update user
// @route POST/api/v1/auth/users/:id
// @access Private/Admin
exports.UpdateUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc Delete user
// @route POST/api/v1/auth/users/:id
// @access Private/Admin
exports.DeleteUser = AsyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)
  res.status(200).json({
    success: true,
    data: {}
  })
})
