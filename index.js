const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(cors())
// app.use(morgan('tiny'))

morgan.token('request-body', function getRequestBody(req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
    } else if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'The name already exists in the phonebook'
        })
    }

    const id = Math.floor(Math.random() * 1000)

    const newPerson = {
        "id": id,
        "name": body.name,
        "number": body.number
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`server is running on port ${PORT}`)) 