require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
// app.use(morgan('tiny'))

morgan.token('request-body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'));

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((error) => next(error));
});

app.get('/info', (request, response, next) => {
  const requestTime = new Date(Date.now());

  Person.find({})
    .then((person) => {
      person.send(`<p>Phonebook has info for ${person.length} people at this moment</p> <p>${requestTime}</p>`);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id);

  Person.findById(id)
    .then((person) => (person ? response.json(person) : response.status(404).end()))
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      if (!result) {
        return response.status(404).end();
      }
      return response.status(204).end();
      // result ? response.status(204).end() : response.status(404).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};

app.use(errorHandler);

const { PORT } = process.env;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
