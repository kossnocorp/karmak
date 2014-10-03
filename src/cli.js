var runner = require('./runner');

/**
 * Runs karmpack with passed CL arguments and returns proper exit code.
 * @param {Object} argv
 * @param {function} callback
 */
var cli = function(argv, cb) {
  /** @todo reformat options for runner */
  runner(argv, function(success) {
    cb(success ? 0 : 1);
  });
};

module.exports = cli;

