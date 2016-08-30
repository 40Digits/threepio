const colors = require('colors');

module.exports = {
  info(message) {
    console.log(this.timestamp + message.cyan);
  },
  error(message) {
    console.log(this.timestamp + message.red);
  },
  log(message) {
    console.log(this.timestamp + message);
  },
  get now() {
    let now = new Date();
    return now.getHours() + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);
  },
  get timestamp () {
    return '[' + this.now.yellow + '] ';
  }
};
