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

client.ping(async function(e) {
  if (e) process.exit(0);
  await fetchAndFormat(0, fetch1).catch(() => process.exit(0));
  await fetchAndFormat(5000, fetch2).catch(() => process.exit(0));
  await consolidate().catch(() => process.exit(0));
  process.exit(1);
});


// Censors and consolidates current rows
//
// client.ping(async function(e) {
//   await consolidate();
//   const max = await getMax();

//   for (let i = 0; i < max; i++) {
//     const query = `SELECT * FROM TABOO.Words WHERE id=${i}`;
//     const [res] = await client.queryAsync(query);
//     if (res) {
//       res.taboos = JSON.parse(res.taboos);
//       if (res && !censor(res)) {
//         console.log(res);
//         await deleteCard(res.id).then(() => console.log('----> deleted'));
//       }
//     }
//   }
//   await consolidate();
//   process.exit(0);
// });
