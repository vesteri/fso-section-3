const express = require('express');
const app = express();

app.use(express.json());

let contacts = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(contacts);
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${contacts.length} people.</p>
            <p>${new Date()}</p>`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    console.log('corresponding contact has been found');
    response.json(contact);
  } else {
    console.log("contact with such id doesn't exist");
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const ids = contacts.map((contact) => contact.id);
  let newId = Math.floor(Math.random() * 10000);
  while (ids.includes(newId)) {
    newId = Math.floor(Math.random() * 10000);
  }
  return newId;
};

app.post('/api/persons', (request, response) => {
  console.log('post request recieved');
  const body = request.body;
  console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and/or number missing',
    });
  }

  const names = contacts.map((contact) => contact.name.toLowerCase());
  if (names.includes(body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'this person is already in contacts',
    });
  }

  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  console.log('contact data validated');

  contacts = [...contacts, contact];

  response.json(contact);
  console.log(`${contact.name} added to contacts`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
