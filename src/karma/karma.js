var karma = require('karma');
var logger = require('../logger');
var karmakKarmaUtils = require('./karma_utils');

/**
 * @module karmakKarma
 * Functionality related to Karma.
 */
var karmakKarma = {
  /**
   * @param {object} options
   */
  run: function(options) {
    karmakKarma._log('Starting up');

    options = options || {};

    var baseDir = options.path || process.cwd();

    var karmaConfig = karmakKarma._getConfig({
      baseDir: baseDir,
      configPath: options.configPath
    });

    if (options.singleRun) {
      karmaConfig['singleRun'] = true;
    }

    karmakKarma._log('Running tests');
    karma.server.start(karmaConfig);
  },

  /**
   * @private
   * Reads or generates Karma config.
   * @param {object} options
   * @param {object} [options.baseDir]
   * @param {object} [options.configPath]
   * @returns {object} karma config
   */
  _getConfig: function(options) {
    var karmaConfig = karmakKarmaUtils.readConfig({
      baseDir: options.baseDir,
      path: options.configPath
    });

    var injectedConfig = karmakKarmaUtils.injectConfig(karmaConfig);

    return injectedConfig;
  },

  /**
   * @private
   * Posts to log as "karma" process
   * @param {string} message
   * @param {number?} level
   */
  _log: logger.log.bind(null, 'karma'),

  /**
   * @private
   * Posts error to log as "karma" process
   * @param {string} message
   */
  _error: logger.error.bind(null, 'karma')
};

module.exports = karmakKarma;

