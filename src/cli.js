var runner = require('./runner');

/**
 * Runs karmak with passed CL arguments and returns proper exit code.
 * @param {Object} argv
 * @param {function} callback
 */
var cli = function(argv, callback) {
  process.env.NODE_ENV = 'test';

  var options = {
    webpackConfigPath: argv.webpackConfig,
    karmaConfigPath: argv.karmaConfig,
    patterns: argv.pattern,
    singleRun: argv.singleRun
  };

  runner(options, function(success) {
    callback(success ? 0 : 1);
  });
};

module.exports = cli;

