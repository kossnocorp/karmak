var Promise = require('bluebird');
var runner = require('./runner');
var logger = require('./logger');

/**
 * Logs as karamk.
 * @param {string} string
 * @param {number?} level
 */
var log = function(message, level) {
  logger.log('karmak', message, level);
}

/**
 * Runs Karmak with passed options and returns proper exit code.
 * @param {object} program
 * @returns {promise}
 */
var cli = function(program, callback) {
  log('Starting CLI');

  process.env.NODE_ENV = process.env.NODE_ENV || program.env || 'test';

  var options = {
    webpackConfigPath: program.webpackConfig,
    karmaConfigPath: program.karmaConfig,
    patterns: program.pattern,
    singleRun: program.singleRun || false,
    verbose: program.verbose || 'critical'
  };

  var watchedPatterns;
  if (program.pattern) {
    var watchedPatterns = "\n" + program.pattern.map(function(pattern) {
      return '    - ' + pattern;
    }).join("\n");
  }

  log(
    "CLI options:\n" +
    '  * Webpack config path: ' + options.webpackConfigPath + "\n" +
    '  * Karma config path: ' + options.karmaConfigPath + "\n" +
    "  * Watched patters:" + watchedPatterns + "\n",
    '  * Single run?: ' + options.singleRun + "\n",
    '  * Verbose level: ' + options.verbose
  );

  logger.setLevel(options.verbose);

  return new Promise(function(resolve) {
    runner(options, function(success) {
      var exitCode = success ? 0 : 1;
      log('Got exit code: ' + exitCode, logger.levels.INFO);
      resolve(exitCode);
    });
  });
};

module.exports = cli;

