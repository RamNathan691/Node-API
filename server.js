// @desc Logs request console
// Replaced by the ((morgan)) const logger = require('./middleware/logger')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const cookieParser = require('cookie-parser');
const ErrorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const path = require('path')
const mongoSanitize = require("express-mongo-sanitize");// const bodyParser = require('body-parser')
const helmets = require('helmet');// const bodyParser = require('body-parser')
const xss = require('xss-clean')
const app = express()
// adding the cookie-parser middle
// it can be used using the app.use() function
// load env

dotenv.config({ path: './config/config.env' })
// connect Database
connectDB()
// adding the fileupload middleware
app.use(fileupload())

// setting the public Folder
app.use(express.static(path.join(__dirname, 'public')))
// requiring routes
app.use(cookieParser())


const bootcamps = require('./routes/bootcamps')
const course = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const review = require('./routes/reviews')
// Dev logging middleware
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// Santize to analyse the data
app.use(mongoSanitize());
// set security headers
app.use(helmets())
// prevent from adding the script tag anywhere in the websites
app.use(xss())
// mount routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', course)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', review)
// Using the error Hanlder
app.use(ErrorHandler)
// PORT
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} ON PORT :${PORT}`.green.bold))
// handled and unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`.red.bold)
  // close server &exit process
  server.close(() => { process.exit(1) })
})
