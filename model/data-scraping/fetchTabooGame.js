const axios = require('axios');
const {JSDOM} = require('jsdom');

// eslint-disable-next-line no-unused-vars
const Word = {
  word: '',
  taboos: [''],
};

const url = 'http://taboogame.net/';

/**
 * @return {Promise}
 */
async function fetchTabooGameData() {
  return axios.get(url).then((res) => {
    let string = res.data;
    const start = string.indexOf('<div id="card_bg"');
    const end = string.indexOf(
        '<div style="padding-top:10px; padding-bottom:10px;">'
    );
    string = string.slice(start, end);

    const body = new JSDOM(string).window.document.body;
    word = body.getElementsByTagName('b')[0].textContent;

    const list = body.getElementsByTagName('b')[1];
    const taboos = [...list.childNodes].map((li) => li.textContent);

    return {word, taboos};
  });
}

module.exports = {
  fetchTabooGameData,
};
