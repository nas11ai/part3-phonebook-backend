const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.connect(url)
    .then(result => console.log('connected to MongoDB'))
    .catch(err => console.log(`can't connect to MongoDB: ${err}`))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)