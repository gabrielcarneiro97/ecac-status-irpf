const { PubSub } = require('apollo-server');

const { isReady } = require('../../../backend.status');

const channelId = () => Math.random().toString(36).substring(2, 15);

const pubsub = new PubSub();

module.exports = {
  backendIsReady: {
    subscribe: () => {
      const channel = channelId();

      const interval = setInterval(() => {
        pubsub.publish(channel, { backendIsReady: isReady() });

        if (isReady()) clearInterval(interval);
      }, 1000);

      return pubsub.asyncIterator(channel);
    },
  },
};
