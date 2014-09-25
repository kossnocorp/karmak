var runner = require('./runner');

/**
 * Runs karmpack with passed CL arguments and returns proper exit code.
 * @param {Object} argv
 * @returns {Number} exit code (0 for success)
 */
var cli = function(argv) {
  /** @todo reformat options for runner */
  var success = runner(argv);
  return success ? 0 : 1;
};

module.exports = cli;

