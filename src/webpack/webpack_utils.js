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

    var webpackConfigPath =
      options.path || (options.baseDir || process.cwd()) + '/webpack.config';
    var webpackConfig = require(webpackConfigPath);

    return webpackConfig;
  },

  /**
   * Injects karmak hooks into webpack config
   * @param {object} webpackConfig
   * @returns {object} modified webpack config
   */
  injectConfig: function(webpackConfig)  {
    // TODO
  }
};

module.exports = karmakWebpackUtils;

