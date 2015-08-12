'use strict';

var fs = require('fs'),
    colors = require('colors'),
    path = require('path'),

    tasks = function () {
      var files = fs.readdirSync(path.join(__dirname, '..', 'tasks')),
          tasks = '\nAvailable tasks:'.bold;

      for (var i = 0; i < files.length; i++) {
        var name = path.basename(files[i], '.js');

        tasks += '\n  ' + name.green + ' : ' + require(path.join('..', 'tasks', name)).description;
      }

      tasks += '\n';
      return tasks;
    },

    usage = function () {
      var usage = '';

      usage += 'Configuration:\n'.bold;
      usage += '  A global `.threepio` JSON file defined in your home directory.\n'.green;
      usage += '  A `.threepio` JSON file in your current working directory.\n'.green;
      usage += '  Directly pass values in using option key flags.\n\n'.green;

      usage += '  See below for available configuration keys and their compiled values based on your current working directory.\n\n'.cyan

      usage += 'Example usage:\n'.bold

      usage += '  Running individual tasks:\n';
      usage += '  $ threepio mysql\n\n'.green;

      usage += '  Running individual tasks with configuration options:\n';
      usage += '  $ threepio mysql --database my_database_name\n\n'.green;

      usage += '  Using a workflow (may need sudo depending on the tasks defined in your threepio.json file):\n';
      usage += '  $ threepio\n\n'.green;

      usage += 'Please see README for more detailed usage and examples.\n'.cyan;

      return usage;
    };

module.exports = function (config) {

  console.log(tasks());
  console.log(usage());

  // Cleanup config and remove the help flags for a cleaner object
  delete config.h;
  delete config.help;

  console.log('Your current config settings:\n'.bold + JSON.stringify(config, null, 2).green);

};