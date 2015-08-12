'use strict';

var fs = require('fs'),
    path = require('path'),
    colors = require('colors'),
    ejs = require('ejs'),
    Logger = require('../modules/logger');

module.exports = {

  description: 'Creates a vhost file in the config `vhostsDir` directory',

  task: function (config, callback) {

    var vhostFile = path.join(config.vhostsDir, config.siteName + '.conf'),
        vhostTemplatePath = path.join(config.templateDir, 'vhost.ejs'),
        vhostContents, vhostTemplate;

    try {
      vhostTemplate = fs.readFileSync(vhostTemplatePath, 'utf8');
    } catch (e) {
      Logger.error("Your vhost template does not exist at '" + vhostTemplatePath + "'.");
      return;
    }

    vhostContents = ejs.render(vhostTemplate, config);
    fs.writeFile(vhostFile, vhostContents, function (err) {

      if (err) {
        Logger.error('Error creating vhost at \'' + vhostFile + '\'');
        return;
      }

      Logger.info('Created vhost at \'' + vhostFile + '\'');

      // Automatically restart apache if it's not included in the tasks
      if (config.tasks.indexOf('restart-apache') === -1) {
        require('../modules/taskRunner')('restart-apache', config);
      }

      if (callback) {
        callback();
      };
    });
  }
};