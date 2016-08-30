const fs = require('fs');
const Logger = require('../modules/logger');
const path = require('path');
const taskRunner = require('../modules/taskRunner');

module.exports = {
  description: 'Runs all tasks specified in a `threepio.json` file.',

  task(config) {
    // Read the json file and run all the commands
    fs.readFile(path.join(config.baseDirectory, 'threepio.json'), 'utf8', function (err, data) {
      if (err) {
        Logger.error('By running "threepio" with no other task specified, a workflow file, \"threepio.json\", was expected but not found. Please create one or run "threepio --help" to see available tasks to run.');
        return;
      }

      try {
        const workflowTasks = JSON.parse(data);

        for (let i = 0; i < workflowTasks.length; i++) {
          taskRunner(workflowTasks[i], config);
        }
      } catch (e) {
        Logger.error(e.message);
      }
    });
  },
};
