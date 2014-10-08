var fs = require('fs');
var path = require('path');
var minimatch = require('minimatch');
var Promise = require('bluebird');

Promise.promisifyAll(fs);

/**
 * @module karmakWatcherUtils
 * Functionality related to file system watcher.
 */
var karmakWatcherUtils = {
  /**
   * Build entry point from given files list.
   * @param {string[]} files
   * @returns {string} entry file content
   */
  buildEntry: function(files) {
    return files.reduce(function(content, filename) {
      // Windows-compatibility
      var escapedFilename = filename.replace(/\\/g, '\\\\');
      return content + "require('" + escapedFilename + "');\n";
    }, '');
  },

  /**
   * Writes entry point content to file.
   * @param {string} path to entry point
   * @param {string} content of entry point
   * @param {function} done
   */
  writeEntry: function(path, content, done) {
    /** @todo find a way to make it async */
    fs.writeFileSync(path, content);
    done();
  },

  /**
   * Ensures that tmp dir is exists in given path.
   * @param {string} baseDir
   */
  ensureTmpDir: function(baseDir) {
    return fs.mkdirAsync(path.join(baseDir, 'tmp'))
      .catch(function() {}); // Ignore EEXIST (Already exists)
  },

  /**
   * Returns dir for filename.
   * @param {string} filename
   */
  dirFor: function(filename) {
    var captures = filename.match(/(.+\/)[^\/]+$/);
    return captures ? captures[1] : filename;
  },

  /**
   * Sorts files by dir.
   * @param {string[]} files
   */
  sortFiles: function(files) {
    return files
      .slice()
      .sort(function(leftFile, rightFile) {
        var leftFileProcessed = leftFile.replace(/_/g, ' ');
        var rightFileProcessed = rightFile.replace(/_/g, ' ');
        var leftDir = karmakWatcherUtils.dirFor(leftFileProcessed);
        var rightDir = karmakWatcherUtils.dirFor(rightFileProcessed);

        var upper;
        if (leftDir == rightDir) {
          upper = leftFileProcessed > rightFileProcessed;
        } else {
          upper = leftDir > rightDir;
        }

        return upper ? 1 : -1;
      });
  },

  /**
   * Excludes files from passed dir
   * @param {string[]} files
   * @param {string} dir
   */
  excludeDir: function(files, dir) {
    return files.filter(function(file) {
      return(
        !minimatch(file, path.join(dir, '*')) &&
        !minimatch(file, path.join(dir, '**/*'))
      );
    });
  },

  /**
   * Excludes specified file
   * @param {string[]} files
   * @param {string} file
   */
  excludeFile: function(files, file) {
    return files.filter(function(f) {
      return f != file;
    });
  },

  /**
   * Returns true if filename matches passed patterns.
   * @param {string} filename
   * @param {string|string[]} patterns
   * @returns {boolean}
   */
  fileMatches: function(filename, patterns) {
    if (typeof patterns == 'string') {
      patterns = [patterns];
    }

    var matches = false;
    var i, pattern, result;
    for (i in patterns) {
      pattern = patterns[i];
      result = minimatch(filename, pattern);

      if (pattern.charAt(0) == '!') {
        if (!result) return false;
      } else if (result) {
        matches = true;
      }
    }

    return matches;
  }
};

module.exports = karmakWatcherUtils;

