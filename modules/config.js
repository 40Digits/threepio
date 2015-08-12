var path = require('path'),
    fs = require('fs'),
    ejs = require('ejs'),
    merge = require('./merge'),
    argv = require('minimist')(process.argv.slice(2)),

    getConfig = function (filePath) {
      var config = {}

      try {
        config = JSON.parse(fs.readFileSync(filePath).toString());
      } catch (e) {
        // Do nothing, the config file doesn't exist
      }

      return config;
    },

    // Look for the different config locations
    localConfig = getConfig(path.join(process.cwd(), '.threepio')),
    globalConfig = getConfig(path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.threepio')),

    // Default config settings
    defaultConfig = require('../defaultConfig');

module.exports = function () {

  // Merge configs, default < global < local config file < cli options
  var mergedConfig = merge(defaultConfig, globalConfig, localConfig, argv);

  // Basic sanitation of the site name
  mergedConfig.siteName = mergedConfig.siteName.replace(/[^\w]/g, '-').toLowerCase();

  // Set the database name if it's not already set
  if (!mergedConfig.database) {
    mergedConfig.database = mergedConfig.siteName;
  }

  // A very basic sanitation the databasea name
  mergedConfig.database = mergedConfig.database.replace(/[^\w]/g, '_').toLowerCase();

  // Clean the tasks array reference
  // If no tasks are present, let's assume we're using a workflow file that holds the tasks
  mergedConfig.tasks = argv._.length > 0 ? argv._ : ['workflow'];
  delete mergedConfig._;

  // Check if the apache24 was passed as false in the console
  if (typeof argv.apache24 !== 'undefined' && argv.apache24.toLowerCase() === 'false') {
    mergedConfig.apache24 = false;
  }

  // Finally, render any string that needs rendered with ejs
  for (var property in mergedConfig) {
    if (mergedConfig.hasOwnProperty(property) && typeof mergedConfig[property] === 'string') {
      mergedConfig[property] = ejs.render(mergedConfig[property], mergedConfig);
    }
  }

  // If there was a help flag, then launch the help instead of continuing
  if (mergedConfig.h || mergedConfig.help) {
    require('./help')(mergedConfig);
    return false;
  }

  return mergedConfig;

};