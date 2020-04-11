const express = require('express')
const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });
const {
  getReviews,
  getReview,
  AddReview,
  UpdateReview,
  DeleteReview
} = require('../controllers/reviews');
const { protect, authorize } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResult')
router
  .route('/').get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews)
router.route('/').post(protect, authorize('user','admin'), AddReview)
router.route('/:id').get(getReview).put(protect,authorize('user' , 'admin' ) , UpdateReview).delete(protect,authorize('user' , 'admin' ),DeleteReview)
module.exports = router
