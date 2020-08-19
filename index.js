const express = require('express');
const morgan = require('morgan');
const router = require('./router');

// env expectations:
// TB_ACCESS_KEY, TB_APP_PORT, TB_MYSQL_USERNAME, TB_MYSQL_PW

const app = express();
app.use(morgan('short'));
app.use('/api', router);

const PORT = process.env.TB_APP_PORT || 3000;

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
