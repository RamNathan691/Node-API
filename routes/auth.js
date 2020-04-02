const express = require('express')
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
} = require('../controllers/auth');
const { protect } = require('../middleware/auth')
const router = express.Router()
router
  .post('/register', register)
  .post('/login', login)
  .get('/getme', protect, getMe)
  .post('/forgotPassword', forgotPassword)
  .put('/resetPassword/:resetToken', resetPassword);
module.exports = router
