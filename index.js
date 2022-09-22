const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(express.static('build'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
    console.log('.............................');
  });
});

app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`<p>Phonebook has info for ${persons.length} people.</p>
              <p>${new Date()}</p>`);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const idToFind = request.params.id;
  Person.findById(idToFind).then((person) => {
    console.log('corresponding contact has been found');
    response.json(person);
  });
  //console.log("contact with such id doesn't exist");
  //response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', morgan(':body'), (request, response) => {
  console.log('post request recieved');
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and/or number missing',
    });
  }

  /*
  const names = contacts.map((contact) => contact.name.toLowerCase());
  if (names.includes(body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'this person is already in contacts',
    });
  }
*/

  const person = new Person({
    name: body.name,
    number: body.number,
    id: body.id,
  });
  console.log('adding new contact');
  person
    .save()
    .then((result) => {
      console.log(`added ${person.name} number ${person.number} to contacts`);
      response.json(person);
    })
    .catch((error) => {
      console.log(error);
      response.status(400).json({
        error: error,
      });
    });
});

app.patch('/api/persons/:id', (request, response) => {
  console.log('patch request recieved');
  Person.findByIdAndUpdate(request.params.id, { number: request.body.number })
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
