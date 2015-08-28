'use strict';

var Logger = require('../modules/logger'),
    colors = require('colors'),
    fs = require('fs'),
    path = require('path');

// This dynamically requires a task based on the filepath and runs it
module.exports  = function taskRunner(taskName, config) {
  var taskPath = path.join(__dirname, '..', 'tasks', taskName);

  // If we're trying to run a workflow profile defined within the config
  if (taskName.indexOf('workflow:') !== -1) {
    var profile = taskName.replace('workflow:', '');

    // If the profile exists, run it, otherwise tell about it
    if (typeof config.workflows !== 'undefined' && typeof config.workflows[profile] !== 'undefined') {

      Logger.log('Running workflow profile \'' + ' '.bgGreen + profile.white.bgGreen.bold + ' '.bgGreen + '\'...');

      // Run the defined tasks
      for (var i = 0; i < config.workflows[profile].length; i++) {
        taskRunner(config.workflows[profile][i], config);
      }

    } else {
      Logger.error('You do not have a workflow profile named \'' + profile + '\' defined anywhere.');
    }
  } else { // Just a normal task name
    // Only run if the file exists, doi
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
        Logger.log('Finished \'' + taskName.cyan + '\', but with ' + 'errors'.red.underline + '!');
      }
    });
  }
};