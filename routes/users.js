const express = require('express')
const {
  getUsers,
  getUser,
  createUser,
  UpdateUser,
  DeleteUser
} = require('../controllers/users')
const User = require('../models/User')
const advancedResults = require('../middleware/advancedResult')
const router = express.Router({ mergeParams: true })
const { protect, authorize } = require('../middleware/auth')
router.use(protect)
router.use(authorize('admin'))
router
  .route('/').get(advancedResults(User), getUsers)
router.route('/').post(createUser)
router.route("/:id").get(getUser).put(UpdateUser).delete(DeleteUser);

module.exports = router
