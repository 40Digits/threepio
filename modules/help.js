const fs = require('fs');
const colors = require('colors');
const path = require('path');

const logTasks = () => {
  const files = fs.readdirSync(path.join(__dirname, '..', 'tasks'));
  let tasks = '\nAvailable tasks:'.bold;

  for (let file of files) {
    const name = path.basename(file, '.js');
    const module = require(path.join('..', 'tasks', name));
    tasks += `\n  ${name.green} : ${module.description}`;
  }

    tasks += '\n';
    return tasks;
};

const specifyUsage = () => {
  let usage = '';

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

module.exports = (config) => {
  console.log(logTasks());
  console.log(specifyUsage());

  // Cleanup config and remove the help flags for a cleaner object
  delete config.h;
  delete config.help;

  console.log('Your current config settings:\n'.bold + JSON.stringify(config, null, 2).green);
};
