const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const Logger = require('./logger');
const merge = require('./merge');
const argv = require('minimist')(process.argv.slice(2));

const getConfig = (filePath) => {
  let config = {};

  try {
    config = JSON.parse(fs.readFileSync(filePath).toString());
  } catch (e) {
    // Do nothing, the config file doesn't exist
    // Or there was malformed json
    if (e instanceof SyntaxError) {
      Logger.error("There is a JSON syntax error in '" + filePath + "'. This configuration file could not be included.\n\n  Error: " + e.message + '\n');
    }
  }

  return config;
};

    // Look for the different config locations
const localConfig = getConfig(path.join(process.cwd(), '.threepio'));
const globalConfig = getConfig(path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.threepio'));

    // Default config settings
const defaultConfig = require('../defaultConfig');

module.exports = () => {

  // Merge configs, default < global < local config file < cli options
  const mergedConfig = merge(defaultConfig, globalConfig, localConfig, argv);

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

  // Clean up workflow profiles if they are defined
  if (typeof mergedConfig.workflows !== 'undefined') {
    for (let key in mergedConfig.workflows) {
      let profileTasks = [];

      for (let index in mergedConfig.workflows[key]) {
        profileTasks.push(mergedConfig.workflows[key][index]);
      }

      mergedConfig.workflows[key] = profileTasks;
    }
  }

  // Check if the apache24 was passed as false in the console
  if (typeof argv.apache24 !== 'undefined' && argv.apache24.toLowerCase() === 'false') {
    mergedConfig.apache24 = false;
  }

  // Finally, render any string that needs rendered with ejs
  for (let property in mergedConfig) {
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
