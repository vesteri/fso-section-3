const express = require('express');
const app = express();

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

app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${contacts.length} people.</p>
            <p>${new Date()}</p>`);
});

app.get('/api/contacts/:id', (request, response) => {
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

app.delete('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
