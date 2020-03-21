const Bootcamp = require('../models/Bootcamps')
const ErrorResponse = require('../utils/errorResponse')
const AsyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
// @desc  Get all bootcamps
// @route GET/api/v1/bootcamps
// @access Public
exports.getBootcamps = AsyncHandler(async (req, res, next) => {
  let query
  // copy req.query
  const reqQuery = { ...req.query }
  // Fields to exclude like select
  const removeFields = ['select', 'sort', 'page', 'limit']
  // loop over the removeFields and delete them from the reqQuery
  removeFields.forEach(params => delete reqQuery[params])
  // this is used to add the money sign to the query string so that you may be able find the corresponding value based on the data in the query
  let queryStr = JSON.stringify(reqQuery)

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  query = Bootcamp.find(JSON.parse(queryStr))
  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(',')
    query = query.select(fields)
  }
  // this is for the sorting of the fielda - means asc + desc
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }
  // adding the pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()
  query = query.skip(startIndex).limit(limit)
  // console.log(query)
  const bootcamps = await query
  // Pagination result
  const pagination = {}
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit
    }
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit
    }
  }
  if (!bootcamps) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  res
    .status(200)
    .json({ success: true, counts: bootcamps.length, pagination , data: bootcamps })
})

// ------------------------------------------------------------------------------------------------------------------------------------------

// @desc  SINGLE all bootcamps
// @route GET/api/v1/bootcamps/:id
// @access Public
exports.getBootcamps1 = AsyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.findById(req.params.id)
  res.status(200).json({ success: true, data: bootcamps })
  // res.status(400).json({ success: false })
})

// -------------------------------------------------------------------------------------------------------------------------------------------

// @desc  create all bootcamps
// @route POST/api/v1/bootcamps/
// @access Private
exports.createBootcamps = AsyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({ success: true, data: bootcamp })
  // res.status(400).json({ success: false })
})
// ---------------------------------------------------------------------------------------------------------------------------------------------

// @desc   UPDATE a bootcamps
// @route PUT/api/v1/bootcamps/:id
// @access Private
exports.updateBootcamps = AsyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: bootcamp })
})
// -----------------------------------------------------------------------------------------------------------------------------------------------

// @desc  Delete A bootcamps
// @route DELETE/api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamps = AsyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: {} })
})
// --------------------------------------------------------------------------------------------------------------------------------------------------

exports.getBootcampsInRadius = AsyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params
  console.log(zipcode, distance)
  // Get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth radius = 3,963 mi/ 6,378 miles
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})
