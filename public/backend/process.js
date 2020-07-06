const server = require('./services/graphql/server');
const { loadChromium } = require('./services/puppeteer');
const { init } = require('./services/db/db.service');

const { ready } = require('./backend.status');

server.listen().then(async ({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);

  await init();

  await loadChromium();

  ready();
});
