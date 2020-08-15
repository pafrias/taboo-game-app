const Promise = require('bluebird');
const redis = require('redis');

let client = redis.createClient();

Promise.promisifyAll(client);

async function checkDataWriting(N) {
  let counter = 0;

  for (let i = 0; i < N; i++) {
    let promises = [];
    for (let j = 0; j < 10; j++) {
      let string = 'taboo' + counter++;
      let req;
      if (j === 0) req = client.getAsync(string).then(res => console.log(res)).catch(e => console.log(e));
      else req = client.getAsync(string).catch(e => console.log(e));
      promises.push(req);
    }

    console.log(`set ${i} started`);
    await Promise.all(promises).catch(e => console.log(e));
    console.log(`set ${i} complete`)
  }
}

checkDataWriting(10).then(() => {
  process.exit(0);
});



