#!/usr/bin/env node

const config = require('./modules/config')();
const taskRunner = require('./modules/taskRunner');

if (config) {
  // Loop through the tasks and run it
  for (let i = 0; i < config.tasks.length; i++) {
    taskRunner(config.tasks[i], config);
  }
}
