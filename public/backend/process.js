const server = require('./services/graphql/server');
const { loadChromium } = require('./services/puppeteer');
const { init } = require('./services/db/db.service');

init().then(loadChromium).then(server.start);

// loadChromium();

// server.start(() => console.log('Server is running on localhost:4000'));
