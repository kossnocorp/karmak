var Promise = require('bluebird');
var runner = require('./runner');

/**
 * Runs Karmak with passed options and returns proper exit code.
 * @param {object} program
 * @returns {promise}
 */
var cli = function(program, callback) {
  process.env.NODE_ENV = process.env.NODE_ENV || program.env || 'test';

  var options = {
    webpackConfigPath: program.webpackConfig,
    karmaConfigPath: program.karmaConfig,
    patterns: program.pattern,
    singleRun: program.singleRun
  };

  return new Promise(function(resolve) {
    runner(options, function(success) {
      resolve(success ? 0 : 1);
    });
  });
};

module.exports = cli;

