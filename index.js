const express = require('express');
const morgan = require('morgan');
const router = require('./router');

// env expectations:
// TABOO_ACCESS_KEY, TABOO_APP_PORT, MYSQL_USERNAME, MYSQL_PW

const app = express();
app.use(morgan('short'));
app.use('/api', router);

const PORT = process.env.TABOO_APP_PORT || 3000;

app.listen(PORT, (e) => {
  if (e) {
    console.log('An error occured: ');
    console.log(e);
    console.log('exitting');
    process.exit(0);
  }
  console.log(`listening@port:${PORT || 3000}`);
});

module.exports = {
  router,
};
