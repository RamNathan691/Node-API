// @desc Logs request console
// Replaced by the ((morgan)) const logger = require('./middleware/logger')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const ErrorHandler = require('./middleware/error')
// const bodyParser = require('body-parser')
// load env
dotenv.config({ path: './config/config.env' })
// connect Database
connectDB()
// requiring routes
const bootcamps = require('./routes/bootcamps')
const course = require('./routes/courses')
const app = express()
// Dev logging middleware
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// mount routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses',course)
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
