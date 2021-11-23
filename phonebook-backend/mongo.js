const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give passowrd as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://user0:${password}@cluster0.xgryw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})

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

if (process.argv.length = 3 ) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {3
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length = 4) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    }).catch(e => console.log(e))

    
}