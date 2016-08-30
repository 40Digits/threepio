const fs = require('fs');
const path = require('path');
const Logger = require('../modules/logger');

module.exports = {
  description: 'Renames a theme folder (\'wp-theme\') to the config\'s site name',

  task(config, callback) {
    try {
      const wpThemePath = path.join(config.baseDirectory, 'wp-content/themes/wp-theme');
      const siteNamePath = path.join(config.baseDirectory, 'wp-content/themes', config.siteName);
      fs.renameSync(wpThemePath, siteNamePath);
      Logger.info(`WP theme folder renamed to ${config.siteName}`);
    } catch (e) {
      Logger.log('Could not find \'' + 'wp-theme'.cyan + '\' in your themes folder. It\'s possible it has already been renamed or doesn\'t exist.');
    }

    if (callback) {
      callback();
    }
  },
};
