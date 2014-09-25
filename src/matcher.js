var TEST_HELPER_PATTERN = /(test|spec)(-|_)helper\./;
var TEST_FILE_PATTERN = /(-|_)(test|spec)\./;

/**
 * Karmpack matcher functionality.
 */
var matcher = {
  /**
   * Checks if passed file name is test helper.
   * @param {String} filename
   * @returns {Boolean} test helper?
   */
  isTestHelper: function(filename) {
    return TEST_HELPER_PATTERN.test(filename);
  },

  /**
   * Checks if passed file name is test file.
   * @param {String} filename
   * @returns {Boolean} test file?
   */
  isTestFile: function(filename) {
    return TEST_FILE_PATTERN.test(filename);
  }
};

module.exports = matcher;

