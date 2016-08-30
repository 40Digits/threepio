const open = require('open');

module.exports = {
  description: 'Opens `localUrl` in your default browser',

  setHTTPProtocol(url) {
    if (url.indexOf('http://') === -1) {
      return `http://${url}`;
    }
    return url;
  },

  task(config, callback) {
    const localUrl = this.setHTTPProtocol(config.localUrl);
    open(localUrl);
    if (callback) {
      callback();
    }
  },
};
