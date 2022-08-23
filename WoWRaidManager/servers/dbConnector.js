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
app.get('/roster/user/:user_id', db.getRosterbyUser);
app.get('/spec', db.getAllSpecs)
app.get('/spec/:baseClass/:spec', db.getSpecUID)
app.get('/buffs', db.getBuffTable)
app.get('/user/:user_id', db.getUserbyID)
app.get('/session/:user_id', db.getSessionbyID)
app.get('/items', db.getItems)
app.get('/specToItem', db.getSpecToItem)
app.get('/specData', db.getSpecData)
app.get('/config', db.getConfig)
app.get('/lootSheet/:charName', db.getLootSheetByCharName)
app.get('/character/:charName', db.getCharUIDByCharName)
app.get('/sheetLock/:char_name', db.getSheetLock)
app.get('/masterLootsheet', db.getMasterLootSheet)
app.get('/raids', db.getRaids)
app.get('/raidWeeks', db.getRaidWeeks)
app.get('/officers', db.getOfficers)

app.patch('/roster',db.updateCharacter)
app.patch('/session',db.updateSession)
app.patch('/config', db.updateConfig)
app.patch('/updateSheetLimitandRanking', db.updateSheetLimitandRanking)

app.patch('/updateRaidWeek', db.updateRaidWeek)

app.post('/roster', db.insertCharacter)
app.post('/user', db.insertUser)
app.post('/session', db.insertSession)
app.post('/specToItem', db.insertSpecToItem)
app.post('/lootsheet', db.insertLootSheet)
app.post('/sheetLock', db.insertSheetLock)
app.post('/raid', db.insertRaid)

app.delete('/roster/:charName', db.deleteCharacter)
app.delete('/characterAndSheet', db.deleteCharacterandSheet)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  });
