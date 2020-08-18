/**
 * I have found that in very open API's, there are some things I just don't want
 * in my game of Taboo. Seriously people, come on.
*/

/**
 * @description removes slurs and some profanity
 * @param {*} string
 * @return {string}
 */
function censor(string = 'asdf') {
  const banned = [
    'faggot', 'fuck', 'shit', 'jigaboo', 'nigger', 'kike', 'retard', ' gay ',
  ];

  for (const word of banned) {
    if (string === '') return false;
    if (string.toLowerCase().includes(word)) return false;
  }
  return true;
}

/**
 *
 * @param {Object} data
 * @return {Boolean}
 */
function censorData(data) {
  const hintsAllowed = data.taboos.map(censor).every((v) => v);
  if (hintsAllowed && censor(data.word)) return true;
  return false;
}

module.exports = {
  censorData,
};
