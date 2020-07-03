const { isReady } = require('../../../backend.status');

const channelId = () => Math.random().toString(36).substring(2, 15);

module.exports = {
  backendIsReady: (parent, args, { pubsub }) => {
    const channel = channelId();

    const interval = setInterval(() => {
      pubsub.publish(channel, { status: isReady() });

      if (isReady()) clearInterval(interval);
    }, 1000);

    return pubsub.asyncIterator(channel);
  },
};
