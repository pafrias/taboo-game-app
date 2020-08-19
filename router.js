const express = require('express');
const {readCards, deleteCard} = require('./model/model');
const {fetchNewCards} = require('./model/data-scraping');

const router = new express.Router;

router.get('/cards', (req, res) => {
  const prevCards = req.query.prevCards;

  readCards(JSON.parse(prevCards || '[]'))
      .then((rows) => {
        rows.forEach((row) => row.taboos = JSON.parse(row.taboos));
        res.send(rows);
      }).catch((e) => res.send(e));
});

router.delete('/cards/:cardID', (req, res) => {
  const auth = req.headers.authorization;
  // console.log(auth);
  if (auth && auth === process.env.TB_ACCESS_KEY) {
    const cardID = req.params.cardID;
    deleteCard(cardID)
        .then((e) => {
        // console.log(e);
          res.sendStatus(200);
        }).catch((e) => res.send(e));
  } else {
    res.sendStatus(401);
  }
});

router.put('/cards', (req, res) => {
  const auth = req.headers.authorization;
  // console.log(auth);
  if (auth && auth === process.env.TABOO_ACCESS_KEY) {
    fetchNewCards(0, 500).then(() => {
      res.sendStatus(200);
    }).catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(401);
  }
});

router.use(express.static('./dist'));

module.exports = router;
