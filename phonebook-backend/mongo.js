const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
    console.log('give passowrd as argument')
    // eslint-disable-next-line no-undef
    process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]

const url = `mongodb+srv://user0:${password}@cluster0.xgryw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)


// eslint-disable-next-line
if (process.argv.length = 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {3
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

// eslint-disable-next-line
if (process.argv.length = 4) {
    const person = new Person({
        // eslint-disable-next-line no-undef
        name: process.argv[3],
        // eslint-disable-next-line no-undef
        number: process.argv[4]
    })

    // eslint-disable-next-line no-unused-vars
    person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    }).catch(e => console.log(e))
}