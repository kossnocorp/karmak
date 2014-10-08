var path = require('path');
var objectAssign = require('object-assign');
var WebpackOnBuildPlugin = require('./webpack_on_build_plugin');
var WebpackRewirePlugin = require('rewire-webpack');

/**
 * @module karmakWatcherUtils
 * Functionality related to webpack.
 */
var karmakWebpackUtils = {
  /**
   * Reads webpack config.
   * @param {object} options
   * @param {string} [options.baseDir=process.cwd()] base dir
   * @param {string} [options.path=process.cwd()+'/webpack.config.js'] webpack
   * config path.
   * @returns {object} webpack config
   */
  readConfig: function(options) {
    options = options || {};

    var webpackConfigPath = path.resolve(
      options.baseDir || process.cwd(),
      options.path || './webpack.config.js'
    );
    var webpackConfig = require(webpackConfigPath);

    return webpackConfig;
  },

  /**
   * Generates basic webpack config.
   * @param {string} baseDir (webpack context)
   * @returns {object} basic webpack config
   */
  generateConfig: function(baseDir)  {
    return {
      cache: true,
      context: baseDir,
      resolve: { root: baseDir }
    };
  },

  /**
   * Injects karmak hooks into webpack config.
   * @param {object} webpackConfig
   * @param {string} baseDir
   * @param {function} callback (on build callback)
   * @returns {object} modified webpack config
   */
  injectConfig: function(webpackConfig, baseDir, callback)  {
    var injectedConfig = objectAssign({}, webpackConfig);

    injectedConfig['entry'] = {
      tests: path.join(baseDir, 'tmp', 'karmak_entry.js')
    };

    injectedConfig['plugins'] = injectedConfig.plugins || [];
    injectedConfig['plugins'].push(new WebpackOnBuildPlugin(callback));
    injectedConfig['plugins'].push(new WebpackRewirePlugin());

    return injectedConfig;
  }
};

module.exports = karmakWebpackUtils;

