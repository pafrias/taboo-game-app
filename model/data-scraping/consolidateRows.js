const {client} = require('../client');


/**
 *
 * @param {Number} emptyID
 * @param {Number} maxID
 * @return {Promise}
 */
async function consolidateSqlRow(emptyID, maxID) {
  const query = `UPDATE TABOO.Words SET id=${emptyID} WHERE id=${maxID}`;
  return client.queryAsync(query)
      .catch((e) => console.log(e.sqlMessage));
}

/**
 * @description recurse through all rows of the table, filling empty rows with
 * greater id numbers
 */
async function consolidateRows() {
  let max = await client.queryAsync('SELECT MAX(id) AS max FROM TABOO.Words');
  max = max[0].max;

  for (let i = 0; i < max; i++) {
    const query = `SELECT id FROM TABOO.Words WHERE id=${i}`;
    const res = await client.queryAsync(query);
    if (!res.length) {
      await consolidateSqlRow(i, max)
          .catch((e) => console.log(e.sqlMessage));
      console.log(`consolidated row ${max} to ${i}`);

      max = await client.queryAsync('SELECT MAX(id) AS max FROM TABOO.Words')
          .catch((e) => console.log(e.sqlMessage));
      max = max[0].max;
    }
  }
}

module.exports = {
  consolidateRows,
};
