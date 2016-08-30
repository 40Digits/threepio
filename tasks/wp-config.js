const fs = require('fs');
const path = require('path');
const Logger = require('../modules/logger');

const createFile = function (config, wpConfigSample, callback) {
  const wpConfig = wpConfigSample.replace('database_name_here', config.database)
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

  task(config, callback) {
    // Check for wp-config.sample first (40D's version)
    const wpConfigDotSamplePath = path.join(config.baseDirectory, 'wp-config.sample');
    fs.readFile(wpConfigDotSamplePath, 'utf8', (err, wpConfigSample) => {
      // Check for wp-config-sample.php (WP's default sample config file)
      if (err) {
        Logger.log('\'' + 'wp-config.sample'.cyan + '\' was not found. Looking for ' + '\'' + 'wp-config-sample.php'.cyan + '\'...');
        const wpConfigSamplePHPPath = path.join(config.baseDirectory, 'wp-config-sample.php');
        fs.readFile(wpConfigSamplePHPPath, 'utf8', (err, wpConfigSample) => {
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
  },
};
