const mongoose = require("mongoose");

const param = process.argv;
if (param.length !== 3 && param.length !== 5) {
  process.exit(1);
}

const password = param[2];

const url = `mongodb+srv://vesteri:${password}@cluster0.rzml3.mongodb.net/personsApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
  console.log("phonebook:");
  Person.find({}).then((contacts) => {
    contacts.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: param[3],
    number: param[4],
    id: Math.floor(Math.random() * 10000),
  });

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
