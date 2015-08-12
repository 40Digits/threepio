'use strict';

var colors = require('colors');

module.exports = {
  info: function (message) {
    console.log(this.timestamp + message.cyan);
  },
  error: function (message) {
    console.log(this.timestamp + message.red);
  },
  log: function (message) {
    console.log(this.timestamp + message);
  },
  get now () {
    var now = new Date();
    return now.getHours() + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);
  },
  get timestamp () {
    return '[' + this.now.yellow + '] ';
  }
};