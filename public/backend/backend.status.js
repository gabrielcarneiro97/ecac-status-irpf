let isReady = false;

module.exports = {
  isReady: () => isReady,
  ready: () => {
    isReady = true;
  },
};
