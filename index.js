#!/usr/bin/env node

'use strict';

var config = require('./modules/config')(),
		taskRunner = require('./modules/taskRunner');

if (config) {
	// Loop through the tasks and run it
	for (var i = 0; i < config.tasks.length; i++) {
		taskRunner(config.tasks[i], config);
	}
}
