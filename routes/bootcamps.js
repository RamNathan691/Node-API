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
// we are using the advanced middleware here
const Bootcamp = require('../models/Bootcamps')
const advancedResults = require('../middleware/advancedResult')
// Include other model routers also
const courseRouter = require('./courses')
// Reroute into the other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.route('/:id/photo').put(bootcampPhotoUpload)
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamps)
router.route('/:id')
  .get(getBootcamps1)
  .put(updateBootcamps)
  .delete(deleteBootcamps)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
module.exports = router
