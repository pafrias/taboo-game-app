const Promise = require('bluebird');
const axios = require('axios');
const {JSDOM} = require('jsdom');
const client = require('../model.js');

async function gatherDataMysql() {
  let url = 'https://playtaboo.com/ajax/v1/next?' + Date.now();

  for (let i = 0; i < 1000; i++) {
    let promises = [];
    for (let j = 0; j < 10; j++) {
      let req = axios.get(url).then(res => {
        let string = res.data.split('\r').map(s => s.trim()).join('');

        let body = new JSDOM(string).window.document.body;

        data.word = body.getElementsByTagName('h2')[0].textContent;

        data.taboos = [];
        let list = body.getElementsByTagName('li');
        for (let i= 0; i < list.length; i++) {
          let taboo = list[i].textContent;
          taboo = taboo.split("'").join("\'")
          data.taboos.push(taboo);
        }

        return client.insertCard(data).catch(client.ignoreDup);

      });
      promises.push(req);
    }

    await Promise.all(promises).catch(client.ignoreDup);
    if (i % 10 === 9) console.log(`${10 * (i + 1)} words complete`);
  }

  return client.queryAsync('SELECT COUNT(*) FROM Words;');

}

gatherDataMysql().then((r) => {
  console.log('rows: ', r)
  process.exit(0);
});