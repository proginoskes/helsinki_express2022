// import mongoose
const mongoose = require('mongoose');

// connect to mongodb
const db_url = process.env.MONGODB_URI;
console.log(`connecting to ${db_url}`)

mongoose
    .connect(db_url)
    .then(result => {
        console.log(`connected to MongoDB`);
    })
    .catch((error)=>{
        console.log(`error connecting to MongoDB: ${error.message}`);
    });


/*
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

*/

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('Person', personSchema);