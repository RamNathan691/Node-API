const ErrorResponse = require('../utils/errorResponse')
const AsyncHandler = require('../middleware/async')
const Course = require('../models/Course')

// @desc  Get all bootcamps
// @route GET/api/v1/course
// @route GET/api/v1/bootcamps/:bootcamps/courses
// @access Public

exports.getCourses = AsyncHandler(async (req, res, next) => {
  let query

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Course.find()
  }
  const course = await query

  res.status(200).json({
    success: true,
    count: course.length,
    data: course
  })
})
