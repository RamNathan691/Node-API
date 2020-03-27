const ErrorResponse = require('../utils/errorResponse')
const AsyncHandler = require('../middleware/async')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamps')

// @desc  Get all bootcamps
// @route GET/api/v1/course
// @route GET/api/v1/bootcamps/:bootcamps/courses
// @access Public

exports.getCourses = AsyncHandler(async (req, res, next) => {
  let query

  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId })
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    })
  } else {
    res.status(200).json(res.advancedResults);
  }
  // const course = await query

  // res.status(200).json({
  //   success: true,
  //   count: course.length,
  //   data: course
  // })
})
// @desc  Get single course
// @route GET/api/v1/course
// @access Public

exports.getCourse = AsyncHandler(async (req, res, next) => {
  const course = await (await Course.findById(req.params.id)).populate
  ({
    path: 'bootcamp',
    select: 'name description'
  })
  if (!course) {
    return next(new ErrorResponse(`No coures with the id of ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    count: course.length,
    data: course
  })
})
// ---------------------------------------------------------------------------------------------

// @desc  ADD  a course
// @route post/api/v1/bootcamps/:bootcampId/courses
// @access Private

exports.addCourse = AsyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`))
  }
  const course = await Course.create(req.body)

  res.status(200).json({
    success: true,
    count: course.length,
    data: course
  })
})

// ----------------------------------------------------------------------------------------
// @desc  Update   a course
// @route PUT /api/v1/courses
// @access PRIVATE

exports.updateCourse = AsyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course) {
    return next(new ErrorResponse(`No Courses with the id of ${req.params.id}`))
  }
  const course1 = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  res.status(200).json({
    success: true,
    data: course1
  })
})
// --------------------------------------------------------------
// @desc  delete   a course
// @route delete /api/v1/courses
// @access PRIVATE

exports.deleteCourse = AsyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course)
  {
    return next(new ErrorResponse(`No Courses with the id of ${req.params.id}`))
  }
  await course.remove()
  res.status(200).json({ success: true, data: [] })
})
