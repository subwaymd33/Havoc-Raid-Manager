const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./characterQueries');
const cors = require('cors');

app.use(cors({
  origin: 'https://localhost:3001',
  origin: 'https://localhost:4200',
  origin: 'http://localhost:4200',

}));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/roster', db.getRoster);
app.get('/roster/:id', db.getRosterbyID);
app.get('/spec', db.getAllSpecs)
app.get('/spec/:baseClass/:spec', db.getSpecUID)
app.get('/buffs', db.getBuffTable)
app.get('/user/:user_id', db.getUserbyID)
app.get('/session/:user_id', db.getSessionbyID)


app.patch('/roster',db.updateCharacter)
app.patch('/session',db.updateSession)

app.post('/roster', db.insertCharacter)
app.post('/user', db.insertUser)
app.post('/session', db.insertSession)

app.delete('/roster/:charName', db.deleteCharacter)




app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  });
