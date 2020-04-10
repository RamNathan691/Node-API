const express = require('express')
const router = express.Router({ mergeParams: true })
const { getReviews, getReview, AddReview } = require('../controllers/reviews')
const { protect, authorize } = require('../middleware/auth')
const Review = require('../models/Review')
const advancedResults = require('../middleware/advancedResult')
router
  .route('/').get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews).post(protect, authorize('user','admin'), AddReview)

router.route('/:id').get(getReview)
module.exports = router
