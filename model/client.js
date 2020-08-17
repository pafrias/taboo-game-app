const mysql = require('mysql');
const Promise = require('bluebird');

const config = {
  user: 'taboo_access',
  password: 'taboo_password',
  database: 'TABOO',
};

const client = mysql.createConnection(config);
Promise.promisifyAll(client);

module.exports = {
  client,
};
