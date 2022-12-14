const mongoose = require('mongoose')
const { Schema, model } = mongoose

const noteSchema = new Schema({
  content: {
    type: String,
    require: true
    // minlength: 12
  },
  date: Date,
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = model('Note', noteSchema)
