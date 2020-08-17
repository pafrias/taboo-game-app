const axios = require('axios');
const {JSDOM} = require('jsdom');
const url = () => 'https://playtaboo.com/ajax/v1/next?' + Date.now();

/**
 * @return {Promise}
 */
async function fetchPlayTabooData() {
  return axios.get(url()).then((res) => {
    const string = res.data.split('\r').map((s) => s.trim()).join('');

    const body = new JSDOM(string).window.document.body;

    const word = body.getElementsByTagName('h2')[0].textContent;

    const taboos = [];
    const list = body.getElementsByTagName('li');
    for (let i= 0; i < list.length; i++) {
      taboos.push(list[i].textContent);
    }

    return {word, taboos};
  });
}

module.exports = {
  fetchPlayTabooData,
};
