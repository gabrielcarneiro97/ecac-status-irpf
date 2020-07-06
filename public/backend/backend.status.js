const pubsub = require('./services/graphql/pubsub');

let isReady = false;

setInterval(() => pubsub.publish('SERVER_STATUS', { isBackReady: isReady }), 1000);

module.exports = {
  isReady: () => isReady,
  ready: () => {
    isReady = true;
  },
};
