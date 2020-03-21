const express = require('express')
const router = express.Router()
const {
  getBootcamps,
  getBootcamps1,
  deleteBootcamps,
  createBootcamps,
  updateBootcamps,
  getBootcampsInRadius
} = require('../controllers/bootcamps')
// Include other model routers also
const courseRouter = require('./courses')
// Reroute into the other resource routers
router.use('/:bootcampId/courses', courseRouter)
router
  .route('/')
  .get(getBootcamps)
  .post(createBootcamps)
router.route('/:id')
  .get(getBootcamps1)
  .put(updateBootcamps)
  .delete(deleteBootcamps)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
module.exports = router
