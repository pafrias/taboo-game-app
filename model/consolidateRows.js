const {client} = require('./client');

async function consolidate(emptyID, maxID) {
  let query = `UPDATE TABOO.Words SET id=${emptyID} WHERE id=${maxID}`
  return client.queryAsync(query)
    .catch(e => console.log(e.sqlMessage));
}

async function consolidateSQLRows(index) {

  let max = await client.queryAsync('SELECT MAX(id) AS max FROM TABOO.Words');
  max = max[0].max;
  //console.log(index, max);
  for (let i = index; i < max; i++) {
    console.log(i, max);

    let query = `SELECT id FROM TABOO.Words WHERE id=${i}`;
    let res = await client.queryAsync(query)
    if (!res.length) {
      await consolidate(i, max)
        .catch(e => console.log(e.sqlMessage));
      console.log(`consolidated row ${max} to ${i}`);

      max = await client.queryAsync('SELECT MAX(id) AS max FROM TABOO.Words')
        .catch(e => console.log(e.sqlMessage));
      max = max[0].max;
      //console.log(max);
    }
  }
  process.exit(1);
}

// client.queryAsync('SELECT MIN(id) AS min FROM TABOO.Words')
//   .then(res => consolidateSQLRows(res[0].min))
//   .catch(e => console.log(e.sqlMessage));

async function formatTabooArrays() {
  let max = await client.queryAsync('SELECT MAX(id) AS max FROM TABOO.Words');
  max = max[0].max;
  
  for (let i = 1; i < max; i++) {
    let query = `SELECT * FROM TABOO.Words WHERE id=${i}`;
    let res = await client.queryAsync(query);
    let taboos = res[0].taboos;

    if (taboos && taboos[0] !== '[') {
      taboos = taboos.split(',').map(str => str.trim());
      taboos = JSON.stringify(taboos);
      let query = `UPDATE TABOO.Words SET taboos='${taboos}' WHERE id=${i}`;
      //console.log(query);
      await client.queryAsync(query).catch(e => console.log(e.sqlMessage));
    }
  }
  console.log('formatting complete');
}

formatTabooArrays();