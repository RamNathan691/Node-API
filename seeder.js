const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// load env vars
dotenv.config({ path: './config/config.env' })
const Bootcamp = require('./models/Bootcamps')
const Course = require('./models/Course')
const User = require('./models/User')
// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

// Read Json Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const course = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(course);
    await User.create(users);
    console.log('Data has been imported to the Database succesfully'.green.inverse)
    process.exit()
  } catch (err) {
    console.log(err)
  }
}
// Delete data
const DeleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    await Course.deleteMany();
    await User.deleteMany();
    console.log('Data has been Destroyed in the Database succesfully'.red.inverse)
    process.exit()
  } catch (err) {
    console.log(Err)
  }
}
if (process.argv[2] == '-i') {
  importData()
} else if (process.argv[2] == '-d') {
  DeleteData()
}
