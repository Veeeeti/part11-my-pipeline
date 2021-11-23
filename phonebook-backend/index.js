require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request,response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (req, res) => {
    res.send(`<p>Phone book has info for ${Person.length} people</p><p>${Date()}</p>`)
})

app.delete('/api/persons/:id' , (request,response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error:'content missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    console.log(person)

    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(e => next(e))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const newPerson = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, newPerson, {new: true})
    .then(updatePerson => {
        response.json(updatePerson)
    })
    .catch(error => next(error))
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
