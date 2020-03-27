// @desc Logs request console
// Replaced by the ((morgan)) const logger = require('./middleware/logger')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const ErrorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const path = require('path')
// const bodyParser = require('body-parser')
const app = express()
// load env
dotenv.config({ path: './config/config.env' })
// connect Database
connectDB()
// adding the fileupload middleware
app.use(fileupload())
// setting the public Folder
app.use(express.static(path.join(__dirname, 'public')))
// requiring routes
const bootcamps = require('./routes/bootcamps')
const course = require('./routes/courses')
const auth = require('./routes/auth')

// Dev logging middleware
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// mount routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', course)
app.use('/api/v1/auth', auth)
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
