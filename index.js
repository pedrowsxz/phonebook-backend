const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
  
const app = express()

app.use(cors())
app.use(express.static('dist'))

morgan.token('req-body', (request, response) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : '';
})
app.use(morgan('tiny :req-body'))


app.use(express.json())

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const dateHeader = new Date().toUTCString()
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${dateHeader}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (!request.body) {
        return response.status(400).json({
            error: 'missing fields'
        })
    }
    if (persons.some(person => person.name === name) )
        return response.status(400).json({
            error: 'name must be unique'
    })

    const person = {
        name: name,
        number: number,
        id: generateId()
    }
    persons = persons.concat(person)
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})