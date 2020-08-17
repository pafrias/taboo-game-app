const express = require('express');
const morgan = require('morgan');
const {readCards, deleteCard} = require('./model/model');

const app = express();
app.use(morgan('short'));

app.get('/api/cards', (req, res) => {

  let prevCards = req.query.prevCards;

  readCards(JSON.parse(prevCards || '[]'))
    .then(rows => {
      rows.forEach(row => row.taboos = JSON.parse(row.taboos));
      res.send(rows)
    }).catch(e => res.send(e));
});

app.delete('/api/cards/:cardID', (req, res) => {
  let cardID = req.params.cardID;
  //console.log(cardID);
  deleteCard(cardID)
    .then(e => {
      //console.log(e);
      res.sendStatus(200);
    }).catch(e => res.send(e));
})

app.use(express.static('./dist'));

app.listen(3000);
