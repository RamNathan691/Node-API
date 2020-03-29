const express = require('express')
const router = express.Router()
const {
  getBootcamps,
  getBootcamps1,
  deleteBootcamps,
  createBootcamps,
  updateBootcamps,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps')
// bringing in the protect middleware
const { protect } = require('../middleware/auth')
// we are using the advanced middleware here
const Bootcamp = require('../models/Bootcamps')
const advancedResults = require('../middleware/advancedResult')
// Include other model routers also
const courseRouter = require('./courses')
// Reroute into the other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.route('/:id/photo').put(protect, bootcampPhotoUpload)
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamps)
router
  .route('/:id')
  .get(getBootcamps1)
  .put(protect, updateBootcamps)
  .delete(protect, deleteBootcamps)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
module.exports = router
