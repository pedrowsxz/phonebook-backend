require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('req-body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})
app.use(morgan('tiny :req-body'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/info', (request, response) => {
  const dateHeader = new Date().toUTCString()
  Person.countDocuments().then(length => {
    response.send(`
      <p>Phonebook has info for ${length} people</p>
      <p>${dateHeader}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  /*const id = request.params.id
  const person = persons.find(person => person.id === id)*/
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  /*const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()*/
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (request, response, next) => {
  const name = request.body.name
  const number = request.body.number

  if (name === undefined || number === undefined) {
    return response.status(400).json({
      error: 'missing fields'
    })
  }
  /*if (persons.some(person => person.name === name) )
    return response.status(400).json({
      error: 'name must be unique'
  })*/

  const person = new Person ({
    name: name,
    number: number,
    id: generateId()
  })

  //persons = persons.concat(person)
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const name = request.body.name
  const number = request.body.number

  if (name === undefined || number === undefined) {
    return response.status(400).json({
      error: 'missing fields'
    })
  }

  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})