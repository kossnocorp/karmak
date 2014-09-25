/**
 * @param {object} options
 * @param {string} [options.baseDir=process.cwd()] base dir
 * @param {string} [options.path=process.cwd()+'/webpack.config.js'] webpack
 * config path.
 * @returns {object} webpack config
 */
var readWebpackConfig = function(options) {
  options = options || {};

  var webpackConfigPath =
    options.path || (options.baseDir || process.cwd()) + '/webpack.config';
  var webpackConfig = require(webpackConfigPath);

  return webpackConfig;
};

module.exports = readWebpackConfig;

