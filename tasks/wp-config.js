'use strict';

var fs = require('fs'),
    path = require('path'),
    Logger = require('../modules/logger'),

    createFile = function (config, wpConfigSample, callback) {
      var wpConfig = wpConfigSample.replace('database_name_here', config.database)
        .replace('username_here', config.mysqlUser)
        .replace('password_here', config.mysqlPw);

      fs.writeFile(path.join(config.baseDirectory, 'wp-config.php'), wpConfig);

      Logger.info('\'wp-config.php\' has been created');

      if (callback) {
        callback();
      }
    };

module.exports = {

  description: 'Creates a wp-config.php file using database name and MySQL credentials found in your the config.',

  task: function (config, callback) {

    // Check for wp-config.sample first (40D's version)
    fs.readFile(path.join(config.baseDirectory, 'wp-config.sample'), 'utf8', function (err, wpConfigSample) {

      // Check for wp-config-sample.php (WP's default sample config file)
      if (err) {
        Logger.log('\'' + 'wp-config.sample'.cyan + '\' was not found. Looking for ' + '\'' + 'wp-config-sample.php'.cyan + '\'...');

        fs.readFile(path.join(config.baseDirectory, 'wp-config-sample.php'), 'utf8', function (err, wpConfigSample) {
          if (err) {
            Logger.error('Unable to find any wp-config sample files (\'wp-config.sample\' or \'wp-config-sample.php\'.');
            return;
          }

          createFile(config, wpConfigSample, callback);
        });

      } else { // We did find the config file
        createFile(config, wpConfigSample, callback);
      }

    });
  }
};