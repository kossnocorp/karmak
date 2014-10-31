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

  'karmak': {
    color: 'white',
    background: 'black'
  },

  'failed': {
    color: 'white',
    background: 'red'
  }
};

var logger = {
  levels: {
    DEBUG: 3,
    INFO: 2,
    CRITICAL: 1,
    SILENT: 0
  },

  /**
   * @param {string} levelStr
   */
  setLevel: function(levelStr) {
    var level;
    switch (levelStr) {
      case 'silent':
        level = logger.levels.SILENT;
        break;

      case 'critical':
        level = logger.levels.CRITICAL;
        break;

      case 'info':
        level = logger.levels.INFO;
        break;

      case 'debug':
        level = logger.levels.DEBUG;
        break;
    }

    logger.level = level;
  },

  /**
   * @param {string} processId
   * @param {string} message
   * @param {number=logger.levels.DEBUG} level
   */
  log: function(processId, message, level) {
    level = level || logger.levels.DEBUG;

    if (logger.level >= level) {
      console.log(
        logger.processStr(processId) + ': ' + message
      );
    }
  },

  /**
   * @param {string} processId
   * @param {string} message
   */
  error: function(processId, message) {
    if (logger.level >= logger.levels.CRITICAL) {
      console.log(
        logger.processStr(processId, true)  + chalk.red(': ' + message)
      );
    }
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

