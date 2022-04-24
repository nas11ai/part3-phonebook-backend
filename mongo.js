const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide a password as an argument: node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length > 5) {
    console.log("Please provide a maximum of 3 arguments: node mongo.js <password> <name> <phone-number>")
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]
const url = `mongodb+srv://nas11ai:${password}@cluster0.jap1z.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    phoneNumber: phoneNumber
})

process.argv.length > 3 ? person.save().then((result) => {
    console.log(`added ${name} ${phoneNumber} to phonebook`)
    mongoose.connection.close()
})
    : Person.find({}).then(
        (result) => {
            console.log('phonebook:')
            result.forEach(
                (person) => console.log(`${person.name} ${person.phoneNumber}`)
            )
            mongoose.connection.close()
        }
    )