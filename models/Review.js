const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10']
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})
// Prevent users from submitting more review per bootcamp
ReviewSchema.index({ bootcamps: 1, user: 1 }, { unique: true })
// To get Average rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  console.log('Calculating the average Cost..'.blue)
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' }
      }
    }
  ]
  )
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: Math.ceil(obj[0].averageRating / 10) * 10
    })
  } catch (err) {
    console.error(err)
  }
  // console.log(obj)
}
// CALL getAverageCost after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp)
})
//  CALL getAverageCost once 'A' has been delete we need to recompute the data of the averageCost
ReviewSchema.pre('save', function () {
  this.constructor.getAverageRating(this.bootcamp)
})
module.exports = mongoose.model('Review', ReviewSchema)
