const pubsub = require('../pubsub');

// const channelId = () => Math.random().toString(36).substring(2, 15);

module.exports = {
  isBackReady: {
    subscribe: () => pubsub.asyncIterator('SERVER_STATUS'),
  },
  isPupBusy: {
    subscribe: () => pubsub.asyncIterator('PUP_STATUS'),
  },
};
