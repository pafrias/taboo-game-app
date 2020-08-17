const {client} = require('./client');

const readQuery = (arr) => `SELECT * FROM TABOO.Words WHERE id IN (${arr.toString()})`;

/**
 * @description return number of entires in Words table
 * @return {Promise}
 */
async function readCardCount() {
  return client.queryAsync('SELECT COUNT(*) as count FROM TABOO.Words');
}

/**
 * @description returns 100 cards not matching the values given
 * @param {[number]} prevArray
 * @return {Promise}
 */
async function readCards(prevArray = []) {
  const result = new Set();
  let count = await readCardCount();
  count = count[0].count;

  for (let i = 0; i < count; i++) result.add(i);
  for (const val of prevArray) result.delete(val);

  while (result.size > 100) {
    const num = Math.floor(Math.random() * count);
    result.delete(num);
  }

  const query = readQuery([...result]);
  return client.queryAsync(query);
}

const insertQuery = (word, taboos) => {
  let str = `INSERT INTO Words (word, taboos) values (?,?);`;
  str = client.format(str, [word, JSON.stringify(taboos)]);
  // console.log(str);
  return str;
};

/**
 * @return {Promise}
 */
async function insertCard({word, taboos}) {
  return client.queryAsync(insertQuery(word, taboos));
}

const deleteQuery = (ID) => `DELETE FROM Words WHERE id=${ID}`;

/**
 * @param {Number} ID
 * @return {Promise}
 */
async function deleteCard(ID) {
  return client.queryAsync(deleteQuery(ID));
}

/**
 * @return {Promise}
 */
async function getMax() {
  return client.queryAsync('SELECT MAX(id) AS max FROM TABOO.Words')
      .then((data) => data[0].max);
}


/**
 * @description Prints first line of Error, ignores sql duplicate errors
 * @param {Error} e
 */
function ignoreDup(e) {
  const str = e.toString().split(/\n|\t/)[0];
  // console.log(str);
  if (str.includes('You have an error in your SQL syntax;')) console.log(e);
  if (!str.startsWith('Error: ER_DUP_ENTRY')) {
    console.log(str);
  }
}


module.exports = {
  readCards,
  readCardCount,
  insertCard,
  deleteCard,
  ignoreDup,
  getMax,
};
