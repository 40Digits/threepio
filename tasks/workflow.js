'use strict';

var fs = require('fs'),
    Logger = require('../modules/logger'),
    colors = require('colors'),
    path = require('path'),
    taskRunner = require('../modules/taskRunner');

module.exports = {

  description: 'Runs all tasks specified in a `threepio.json` file.',

  task: function (config, callback) {

    // Read the json file and run all the commands
    fs.readFile(path.join(config.baseDirectory, 'threepio.json'), 'utf8', function (err, data) {
      if (err) {
        Logger.error('\'threepio.json\' not found. Please create one or run `threepio --help` to see available tasks to run.');
        return;
      }

      try {
        var workflowTasks = JSON.parse(data);

        for (var i = 0; i < workflowTasks.length; i++) {
          taskRunner(workflowTasks[i], config);
        }

      } catch (e) {
        Logger.error(e.message);
      }

    });
  }

};