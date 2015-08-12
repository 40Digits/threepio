'use strict';

var Logger = require('../modules/logger'),
    colors = require('colors'),
    fs = require('fs'),
    path = require('path');

// This dynamically requires a task based on the filepath and runs it
module.exports  = function (taskName, config) {
  var taskPath = path.join(__dirname, '..', 'tasks', taskName);

  // Only require if the file exists
  fs.readFile(taskPath + '.js', function (err, data) {
    if (err) {
      Logger.error('Task \'' + taskName + '\' does not exist. Please run `threepio --help` for available tasks.');
      return;
    }

    // Fire the task
    Logger.log('Starting \'' + taskName.cyan + '\'...');

    try {
      require(taskPath).task(config, function () {
        Logger.log('Finished \'' + taskName.cyan + '\'!');
      });
    } catch (e) {
      Logger.error('Error running ' + path.basename(taskPath) + ': ' + e.message);
    }
  });
};