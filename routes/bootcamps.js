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
const { protect, authorize } = require('../middleware/auth')
// we are using the advanced middleware here
const Bootcamp = require('../models/Bootcamps')
const advancedResults = require('../middleware/advancedResult')
// Include other model routers also
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')
// Reroute into the other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamps)
router
  .route('/:id')
  .get(getBootcamps1)
  .put(protect, authorize('publisher', 'admin'), updateBootcamps)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamps)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
module.exports = router
