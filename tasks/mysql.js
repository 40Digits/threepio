'use strict';

var ejs = require('ejs'),
    exec = require('child_process').exec,
    Logger = require('../modules/logger');

module.exports = {

  description: 'Creates a MySQL database based on the site name.',

  task: function (config, callback) {
    var cmd = ejs.render('mysql --user="<%= mysqlUser %>" --password="<%= mysqlPw %>" -e "CREATE DATABASE IF NOT EXISTS <%= database %>"', config);

    exec(cmd, function (err) {
      if (err) {
        Logger.error('MySQL error: ' + err);
        return;
      }

      Logger.info('MySQL database \'' + config.database + '\' has been created');

      if (callback) {
        callback();
      }
    });
  }
};