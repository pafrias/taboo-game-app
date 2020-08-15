const express = require('express');
const morgan = require('morgan');
const {readCards} = require('./model/model');

const app = express();
app.use(morgan('short'));

app.get('/api/new-cards', (req, res) => {

  let prevCards = req.query.prevCards;

  readCards(JSON.parse(prevCards || '[]'))
    .then(rows => {
      rows.forEach(row => row.taboos = JSON.parse(row.taboos));
      res.send(rows)
    })
    .catch(e => res.send(e))
});

app.use(express.static('./dist'));

app.listen(3000);
