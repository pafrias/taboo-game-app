const mysql = require('mysql');
const Promise = require('bluebird');

const config = {
  user: process.env.TB_MYSQL_USERNAME || 'taboo_access',
  password: process.env.TB_MYSQL_PW || 'taboo_password',
  database: 'TABOO',
};

const client = mysql.createConnection(config);
Promise.promisifyAll(client);

module.exports = {
  client,
};
