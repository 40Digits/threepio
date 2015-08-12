'use strict';

var exec = require('child_process').exec,
    Logger = require('../modules/logger');

module.exports = {

  description: 'Restarts apache; requires sudo permissions',

  task: function (config, callback) {

    // Restart apache
    exec('sudo apachectl -e info -k restart', function (err) {

      if (err) {
        Logger.error('Please run this command with `sudo`');
        return;
      }

      Logger.info('Apache restarted');

      if (callback) {
        callback();
      };
    });
  }
};