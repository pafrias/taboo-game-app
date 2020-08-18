const fetch1 = require('./fetchPlayTaboo').fetchPlayTabooData;
const fetch2 = require('./fetchTabooGame').fetchTabooGameData;
const consolidate = require('./consolidateRows').consolidateRows;
const Promise = require('bluebird');
const {insertCard, ignoreDup} = require('../model');
const {client} = require('../client');
const {censorData} = require('./censor');
// const {getMax, deleteCard} = require('../model');


/**
 *
 * @param {Number} N # of queries
 * @param {Function} func Promise that returns a taboo 'data' object
 */
async function fetchAndFormat(N, func) {
  const promises = [];
  let M = N;
  while (M--) {
    promises.push(func().then((data) => {
      if (data.taboos.length === 5) {
        if (censorData(data)) {
          data.word = data.word.trim();
          data.taboos = data.taboos.map((v) => v.trim());
          return insertCard(data);
        } else console.log(`censored: ${JSON.stringify(data)}`);
      }
    }).catch(ignoreDup));
    if (!(M % 10)) {
      await Promise.all(promises).catch(ignoreDup);
      if (!(M % 50))console.log(`${N-M} entries scraped`);
    }
  }
}

/**
 *
 * @param {Number} N
 * @param {Number} M
 */
async function fetchNewCards(N, M) {
  await fetchAndFormat(N, fetch1).catch((e) => e);
  await fetchAndFormat(M, fetch2).catch((e) => e);
  await consolidate().catch((e) => e);
}

// client.ping(async function(e) {
//   if (e) process.exit(0);
//   await fetchNewCards(0, 5000);
//   process.exit(1);
// });

module.exports = {
  fetchNewCards,
};
