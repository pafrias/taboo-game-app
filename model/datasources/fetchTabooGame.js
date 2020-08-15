const Promise = require('bluebird');
const axios = require('axios');
const {JSDOM} = require('jsdom');
const client = require('../model.js');

function removeQuotes(str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "'") {
      str = str.slice(0,i) + "'" + str.slice(i);
      i++;
    }
  }
  return str;
}

async function gatherDataMysql() {
  let url = 'http://taboogame.net/';

  for (let i = 0; i < 100; i++) {
    let promises = [];
    for (let j = 0; j < 10; j++) {
      let req = axios.get(url).then(res => {
        let string = res.data;
        let start = string.indexOf('<div id="card_bg"');
        let end = string.indexOf('<div style="padding-top:10px; padding-bottom:10px;">');
        string = string.slice(start, end);

        // console.log(string, '\n');

        let body = new JSDOM(string).window.document.body;
        word = body.getElementsByTagName('b')[0].textContent;

        let list = body.getElementsByTagName('b')[1];
        let taboos = [...list.childNodes].map(li => li.textContent);

        let data = {
          word: removeQuotes(word),
          taboos: taboos.map(s => removeQuotes(s))
        };

        return client.insertCard(data).catch(client.ignoreDup);;

      });
      promises.push(req);
    }

    await Promise.all(promises).catch(client.ignoreDup);
    if (i % 10 === 9) console.log(`${10 * (i + 1)} words complete`);
  }

  return client.readCardCount();
  
}

gatherDataMysql().then((r) => {
  console.log('rows: ', r)
  process.exit(0);
});