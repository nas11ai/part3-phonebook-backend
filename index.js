const express = require('express')
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

const PORT = 3001

app.listen(PORT, () => console.log(`server is running on port ${PORT}`)) 