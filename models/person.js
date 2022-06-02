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

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 3
    },
    number: {
      type: String,
      required: true,
      minLength: 8,
      validate: {
        validator: v => {
          const reg = new RegExp('\\d{2,3}-[\\d+]');
          console.log(`${v}: ${reg.test(v)}`)
          return reg.test(v)
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('Person', personSchema);