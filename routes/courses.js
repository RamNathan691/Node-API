const express = require('express')
const router = express.Router({ mergeParams: true })
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse

} = require('../controllers/course')
const { protect, authorize } = require('../middleware/auth')
const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResult')
router.route('/').get(advancedResults(Course, {
  path: 'bootcamp',
  select: 'name description'
}), getCourses)
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse)
router.route('/').post(protect, authorize('publisher', 'admin'), addCourse)

module.exports = router
