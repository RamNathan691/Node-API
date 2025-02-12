const Bootcamp = require('../models/Bootcamps')
const ErrorResponse = require('../utils/errorResponse')
const AsyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const path = require('path')
const User = require('../models/User')
// @desc  Get all bootcamps
// @route GET/api/v1/bootcamps
// @access Public
exports.getBootcamps = AsyncHandler(async (req, res, next) => {
  // if (!bootcamps) {
  //   return next(
  //     new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
  //   );
  // }
  res
    .status(200)
    .json(res.advancedResults)
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
  // Adding user to req.body
  req.body.user = req.user.id
  // Checking for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })
  // if the user is not admin they can add only one bootcamp
  if (publishedBootcamp && req.user.role != 'admin') {
    return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400))
  }
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({ success: true, data: bootcamp })
  // res.status(400).json({ success: false })
})
// ---------------------------------------------------------------------------------------------------------------------------------------------

// @desc   UPDATE a bootcamps
// @route PUT/api/v1/bootcamps/:id
// @access Private
exports.updateBootcamps = AsyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)
  const user = await User.findById(req.user.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  // Making sure that the user is the bootcamp owner  or the ine who has the reference to the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User: ${user.name} is not authorized to update the bootcamp details`, 404))
  }
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  res.status(200).json({ success: true, data: bootcamp })
})
// -----------------------------------------------------------------------------------------------------------------------------------------------

// @desc  Delete A bootcamps
// @route DELETE/api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamps = AsyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  const user = await User.findById(req.user.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User: ${user.name} is not authorized to delete the bootcamp details`,
        404
      )
    )
  }

  bootcamp.remove()
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

// @desc  Upload photo for bootcamp
// @route PUT/api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = AsyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  console.log(bootcamp)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User: ${user.name} is not authorized to Update the bootcamp details`,
        404
      )
    )
   }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a photo file`, 400))
  }
  const file = req.files.file
  console.log(file)
  // Validatio is getting added to see whether the file is really an image or not
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image File', 400))
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload an image File with less than ${process.env.MAX_FILE_UPLOAD}`, 400))
  }
  // THEN WE ARE CHECKING FOR A BOOTCAMP WITH SOME ID For the name of the bootcamp
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
  // this is the uploading process here
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err)
      return next(new ErrorResponse(`File has not been uploaded to  ${process.env.FILE_UPLOAD_PATH}`, 500))
    }
    await Bootcamp.findById(req.params.id, { photo: file.name })
    res.status(200).json({
      success: true,
      data: file.name
    })
  })
})
