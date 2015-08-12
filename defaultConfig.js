var path = require('path');

module.exports = {

  // Your local dev url, which will be built with ejs
  localUrl: '<%= siteName %>.local',

  // Create the site name based on the repo directory name/repo slug
  siteName: path.basename(process.cwd()),

  // Your CWD
  baseDirectory: process.cwd(),

  // File paths n ports
  vhostsDir: '/etc/apache2/extra/vhosts/',
  hostsFile: '/etc/hosts',
  httpPort: '80',

  // Log paths, also built with ejs
  customLog: '/http-logs/<%= siteName %>.log',
  errorLog: '/http-logs/<%= siteName %>.error.log',

  // Mysql credentials
  mysqlUser: 'root',
  mysqlPw: '',

  // Using apache 2.4 for adding the directive to vhost file
  apache24: true,

  // The path to the templates directory
  templateDir: path.join(__dirname, 'templates')

};