const {client} = require('./client');

const readQuery = arr => `SELECT * FROM TABOO.Words WHERE id IN (${arr.toString()})`;

async function readCardCount() {
  return client.queryAsync('SELECT COUNT(*) as count FROM TABOO.Words');
}

async function readCards(prevArray = []) {
  
  let result = new Set();
  let count = await readCardCount();
  count = count[0].count;

  for (let i = 0; i < count; i++) result.add(i);
  for (let val of prevArray) result.delete(val);

  while(result.size > 100) {
    let num = Math.floor(Math.random() * count);
    result.delete(num);
  }

  let query = readQuery([...result]);
  return client.queryAsync(query);

}

let insertQuery = (word, taboos) => `INSERT INTO Words (word, taboos) values ('${word}', '${taboos}');`;

function ignoreDup(e) {
  let str = e.toString().split(/\n|\t/)[0];
  //console.log(str);
  if (str.includes('You have an error in your SQL syntax;')) console.log(e)
  if (!str.startsWith('Error: ER_DUP_ENTRY')) {
    console.log(str);
  }
}

async function insertCard({word, taboos}) {
  
  return client.queryAsync(insertQuery(word, taboos));
}

module.exports = {
  readCards,
  readCardCount,
  insertCard,
  ignoreDup
}