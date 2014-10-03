/**
 * @module logger
 * Karmpack logger.
 */

var chalk = require('chalk');

var COLORS = {
  'watcher': {
    color: 'white',
    background: 'cyan'
  },

  'webpack': {
    color: 'white',
    background: 'blue'
  },

  'karma': {
    color: 'white',
    background: 'yellow'
  },

  'karmpack': {
    color: 'white',
    background: 'black'
  },

  'failed': {
    color: 'white',
    background: 'red'
  }
};

var logger = {
  /**
   * @param {string} processId
   * @param {string} message
   */
  log: function(processId, message) {
    console.log(
      logger.processStr(processId) + ': ' + message
    );
  },

  /**
   * @param {string} processId
   * @param {string} message
   */
  error: function(processId, message) {
    console.log(
      logger.processStr(processId, true)  + chalk.red(': ' + message)
    );
  },

  /**
   * Returns colorfied process string.
   * @param {string} processId
   * @param {boolean} [failed=false]
   */
  processStr: function(id, failed) {
    var colors = COLORS[failed ? 'failed' : id];
    var bgFnName = 'bg' + colors.background.replace(/^(.)/, function(__, c) {
      return c.toUpperCase();
    });
    var colorifyFn = chalk[colors.color][bgFnName];

    return colorifyFn('[' + id.toUpperCase() + ']');
  }
};

module.exports = logger;

