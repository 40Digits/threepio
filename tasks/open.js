'use strict';

var open = require('open');

module.exports = {

  description: 'Opens `localUrl` in your default browser',

  task: function (config, callback) {

    open(config.localUrl.indexOf('http://') === -1 ? 'http://' + config.localUrl : config.localUrl);

    if (callback) {
      callback();
    };
  }
};