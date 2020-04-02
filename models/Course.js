const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add the course title']
  },
  description: {
    type: String,
    required: [true, 'Please add the description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add the number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add the tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [
      true,
      'Please add the minimum skill required to enroll in this Bootcamp'
    ],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
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
});
// Static method to get the average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log('Calculating the average Cost..'.blue)
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]
  )
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    })
  } catch (err) {
    console.error(err)
  }
  console.log(obj)
}
// CALL getAverageCost after save
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp)
})
//  CALL getAverageCost once 'A' has been delete we need to recompute the data of the averageCost
CourseSchema.pre('save', function () {
  this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)
