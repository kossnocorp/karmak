var domain = require('domain');
var prettyjson = require('prettyjson');
var logger = require('./logger');
var watcher = require('./watcher/watcher');
var webpack = require('./webpack/webpack');
var karma = require('./karma/karma');

/**
 * Runs karmak with passed options and returns is task was successful.
 * @param {object} options
 * @param {boolean} [options.webpackConfigPath]
 * @param {boolean} [options.karmaConfigPath]
 * @param {boolean} [options.patterns]
 * @param {boolean} [options.singleRun=false]
 * @param {function} callback
 */
var runner = function(options, callback) {
  var runnerDomain = domain.create();

  runnerDomain.run(function() {
    logger.log('karmak', 'Starting runner...');

    var singleRun = !!options.singleRun;

    var closeWatcher = watcher.watch({
      path: process.cwd() + '/',
      singleRun: singleRun,
      patterns: options.patterns,

      onReady: function() {
        webpack.build({
          path: process.cwd() + '/',
          singleRun: singleRun,
          webpackConfigPath: options.webpackConfigPath,

          onReady: function() {
            karma.run({
              path: process.cwd(),
              singleRun: singleRun,
              configPath: options.karmaConfigPath
            })
          }
        });
      }
    });
  });

  runnerDomain.on('error', function(err) {
    logger.error('karmak', "\n" + prettyjson.render(err));
  });
};

module.exports = runner;

