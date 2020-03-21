const express = require('express')
const router = express.Router({mergeParams: true})
const {
  getCourses

} = require('../controllers/course')

router.route('/').get(getCourses)
module.exports = router
