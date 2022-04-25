require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
// app.use(morgan('tiny'))

morgan.token('request-body', function getRequestBody(req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => response.json(persons))
})

app.get('/info', (request, response) => {
    const requestTime = new Date(Date.now())
    response.send(`<p>Phonebook has info for ${persons.length} people at this moment</p> <p>${requestTime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    person ? response.json(person) : response.status(404).send(`<p>no ingfoo</p>`).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }
    // else if (persons.find(p => p.name === body.name)) {
    //     return response.status(400).json({
    //         error: 'The name already exists in the phonebook'
    //     })
    // }

    const newPerson = new Person({
        "name": body.name,
        "number": body.number
    })

    newPerson.save()
        .then(savedNote => response.json(savedNote))
})

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`server is running on port ${PORT}`)) 