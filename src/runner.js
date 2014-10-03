var logger = require('./logger');
var watcher = require('./watcher/watcher')

/**
 * Runs karmpack with passed options and returns is task was successful.
 * @param {object} options
 * @param {boolean} [options.watch=false] - watch for changes or single run
 * @param {function} callback
 */
var runner = function(options, cb) {
  logger.log('karmpack', 'Starting runner...');

  var singleRun = !options.watch;

  var closeWatcher = watcher.watch({
    path: process.cwd() + '/'
  });

  logger.log('webpack', 'TODO');
  logger.log('karma', 'TODO');
};

module.exports = runner;

