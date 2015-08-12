'use strict';

var fs = require('fs'),
    Logger = require('../modules/logger');

module.exports = {

  description: 'Adds the rendered `localUrl` config property to your hosts file; requires sudo permissions',

  task: function (config, callback) {
    var finished = function () {
      if (callback) {
        callback();
      }
    };

    // Check if file exists at configured locatoin
    fs.readFile(config.hostsFile, 'utf8', function (err, hosts) {

      if (err) {
        Logger.error('No hosts file found at \'' + config.hostsFile + '\', please reconfigure');
        return;
      }

      if (hosts.indexOf(config.localUrl) === -1) {
        fs.writeFile(config.hostsFile, hosts + '\n' + '127.0.0.1\t' + config.localUrl, function (err) {

          if (err) {
            Logger.error('Please rerun this command with `sudo`');
            return;
          }

          Logger.info('\'' + config.localUrl + '\'' + ' has been added to your hosts file');
          finished();
        });
      } else {
        Logger.info('\'' + config.localUrl + '\'' + ' is already exists in your hosts file')
        finished();
      }
    });
  }
};