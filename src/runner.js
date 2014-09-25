/**
 * Runs karmpack with passed options and returns is task was successful.
 * @param {Object} options
 * @param {Boolean} [options.watch=false] - watch for changes or single run
 * @returns {Boolean} success?
 */
var runner = function(options) {
  var singleRun = !options.watch;

  /** @todo build entry point */
  /** @todo run webpack */
  /** @todo run karma */
};

module.exports = runner;

