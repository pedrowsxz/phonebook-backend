require('dotenv').config()
const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Usage: node mongo.js [yourdatabasepassword] [name] [number] or ommit name and number to log all entries')
  process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

/*const personSchema = new mongoose.Schema({
    name: String,
    number: String
})*/

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close
    })
}

if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}



