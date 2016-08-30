const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const Logger = require('../modules/logger');

module.exports = {
  description: 'Creates a vhost file in the config `vhostsDir` directory',

  task(config, callback) {
    const vhostFile = path.join(config.vhostsDir, `${config.siteName}.conf`);
    const vhostTemplatePath = path.join(config.templateDir, 'vhost.ejs');
    let vhostTemplate;

    try {
      vhostTemplate = fs.readFileSync(vhostTemplatePath, 'utf8');
    } catch (e) {
      Logger.error(`Your vhost template does not exist at '${vhostTemplatePath}'.`);
      return;
    }

    const vhostContents = ejs.render(vhostTemplate, config);
    fs.writeFile(vhostFile, vhostContents, (err) => {
      if (err) {
        Logger.error(`Error creating vhost at '${vhostFile}'`);
        return;
      }

      Logger.info(`Created vhost at '${vhostFile}'`);

      // Automatically restart apache if it's not included in the tasks
      if (config.tasks.indexOf('restart-apache') === -1) {
        require('../modules/taskRunner')('restart-apache', config);
      }

      if (callback) {
        callback();
      }
    });
  },
};
