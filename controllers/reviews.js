const Review = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const AsyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamps')
const User = require('../models/User')
// @desc Get Reviews
// @Rroute GET/api/v1/reviews
// @route GET/api/v1/bootcamp/:bootcampID/reviews
// @access Public
exports.getReviews = AsyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc Get Reviews
// @Rroute GET/api/v1/reviews/:id
// @route GET/api/v1/bootcamp/:bootcampID/reviews
// @access Public
exports.getReview = AsyncHandler(async (req, res, next) => {
  const review = await (await Review.findById(req.params.id)).populated(
    {
      path: 'bootcamp',
      select: 'name description'
    })
  if (!review) {
    return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404))
  }
  res.status(200).json({
    success: true,
    data: review
  })
})

// @desc POST Reviews
// @Rroute POST/api/v1/reviews/:id
// @route POST/api/v1/bootcamp/:bootcampId/reviews
// @access Private
exports.AddReview = AsyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = await User.findById(req.user.id)

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review
  })
})

// @desc UPDATE Reviews
// @Rroute PUT/api/v1/reviews/:id

exports.UpdateReview = AsyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(
        `No review with the id of ${req.params.id}`,
        404
      )
    )
  }
  // Make sure review belongs to user or user in admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorised to Update Review`, 401))
  }
   review = await Review.findByIdAndUpdate(req.params.id, req, body, {
    new: true,
    runValidators: true
  })

  res.status(201).json({
    success: true,
    data: review
  })
})

// @desc UPDATE Reviews
// @Rroute PUT/api/v1/reviews/:id

exports.DeleteReview = AsyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(
        `No review with the id of ${req.params.id}`,
        404
      )
    )
  }
  // Make sure review belongs to user or user in admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorised to Update Review`, 401))
  }
 await review.remove()

  res.status(201).json({
    success: true,
    data: review
  })
})
