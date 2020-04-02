const express = require('express')
const { register, login, getMe,forgotPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth')
const router = express.Router()
router
  .post('/register', register)
  .post('/login', login)
  .get('/getme',protect, getMe)
  .post('/forgotPassword',forgotPassword)
module.exports = router
