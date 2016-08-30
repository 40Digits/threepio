const ejs = require('ejs');
const exec = require('child_process').exec;
const Logger = require('../modules/logger');

module.exports = {
  description: 'Creates a MySQL database based on the site name.',

  task(config, callback) {
    const cmd = ejs.render('mysql --user="<%= mysqlUser %>" --password="<%= mysqlPw %>" -e "CREATE DATABASE IF NOT EXISTS <%= database %>"', config);

    exec(cmd, (err) => {
      if (err) {
        Logger.error(`MySQL error: ${err}`);
        return;
      }

      Logger.info(`MySQL database '${config.database}' has been created`);

      if (callback) {
        callback();
      }
    });
  },
};
