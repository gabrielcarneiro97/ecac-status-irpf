const server = require('./services/graphql/server');
const { loadChromium } = require('./services/puppeteer');
const { init } = require('./services/db/db.service');

const { ready } = require('./backend.status');

server.start(async () => {
  console.log('Server is running on localhost:4000');
  await init();

  await loadChromium();

  ready();
});
