var path = require('path');
var objectAssign = require('object-assign');

/**
 * @module karmakKarmaUtils
 * Functionality related to Karma.
 */
var karmakKarmaUtils = {
  /**
   * Reads Karma config.
   * @param {object} options
   * @param {string} [options.baseDir=process.cwd()] base dir
   * @param {string} [options.path='./karma.conf.js'] Karma config path
   * @returns {object} Karma config
   */
  readConfig: function(options) {
    options = options || {};

    var karmaConfigPath = path.resolve(
      options.baseDir || process.cwd(),
      options.path || './karma.conf.js'
    );
    var karmaConfigFn = require(karmaConfigPath);

    var karmaConfig;
    karmaConfigFn({
      set: function(config) {
        karmaConfig = config;
      }
    });

    return karmaConfig;
  },

  /**
   * Generates basic Karma config.
   * @param {string} baseDir
   * @returns {object} basic Karma config
   */
  generateConfig: function(baseDir) {
    return {
      basePath: baseDir,
      files: [],
      browsers: ['PhantomJS']
    };
  },

  /**
   * Injects Karma config.
   * @param {object} karmaConfig
   * @param {string} baseDir
   * @returns {object} injected Karma config.
   */
  injectConfig: function(karmaConfig, baseDir) {
    var injectedConfig = objectAssign({}, karmaConfig);

    injectedConfig['basePath'] = baseDir;

    injectedConfig['files'] = injectedConfig['files'] || [];
    injectedConfig['files'].push('./tmp/karmak_tests.js');

    return injectedConfig;
  }
};

module.exports = karmakKarmaUtils;

