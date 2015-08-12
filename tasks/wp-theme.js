'use strict';

var fs = require('fs'),
    path = require('path'),
    colors = require('colors'),
    Logger = require('../modules/logger');

module.exports = {

  description: 'Renames a theme folder (\'wp-theme\') to the config\'s site name',

  task: function (config, callback) {
    try {
      fs.renameSync(path.join(config.baseDirectory, 'wp-content/themes/wp-theme'), path.join(config.baseDirectory, 'wp-content/themes', config.siteName));
      Logger.info('WP theme folder renamed to ' + config.siteName);
    } catch (e) {
      Logger.log('Could not find \'' + 'wp-theme'.cyan + '\' in your themes folder. It\'s possible it has already been renamed or doesn\'t exist.');
    }

    if (callback) {
      callback();
    };
  }
};