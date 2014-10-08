var path = require('path');
var minimatch = require('minimatch');
var fsWatcher = require('watchr');
var readdir = require('recursive-readdir');
var prettyjson = require('prettyjson');
var Promise = require('bluebird');
var logger = require('./../logger');
var karmakWatcherUtils = require('./watcher_utils');

/**
 * @module karmakWatcher
 * Functionality related to file system watcher.
 */
var karmakWatcher = {
  /**
   * @param {object} options
   * @returns {function} stop watching
   */
  watch: function(options) {
    karmakWatcher._log('Starting up...');

    options = options || {};

    var baseDir = options.path || process.cwd();
    var patterns = options.patterns || [
      '**/*/_test_helper.js',
      '**/*_test.js',
      '!' + 'node_modules/**/*'
    ];

    karmakWatcher._log('Watched dir: ' + baseDir);
    karmakWatcher._log(
      'Watched patterns:' + "\n" + prettyjson.render(patterns)
    );

    var testFiles;

    karmakWatcherUtils.ensureTmpDir(baseDir)
      .then(function() {
        karmakWatcher._buildInitialEntry(baseDir, patterns, function(testFiles) {
          if (options.onInitialBuild) options.onInitialBuild();

          if (options.singleRun) {
            if (options.onReady) options.onReady();

          } else {
            karmakWatcher._startFsWatching(baseDir, patterns, testFiles, function(close) {
              if (options.onReady) options.onReady(close);
            });
          }
        });
      });
  },

  /**
   * Gets the list of existing test files and builds initial entry point.
   * @param {string} baseDir
   * @param {string[]} patterns
   * @param {function} callback
   */
  _buildInitialEntry: function(baseDir, patterns, callback) {
    readdir(baseDir, function(err, files) {
      var testFiles = karmakWatcherUtils.sortFiles(files.filter(function(filename) {
        return karmakWatcherUtils.fileMatches(
          path.relative(baseDir, filename), patterns
        );
      }));
      var entryContent = karmakWatcherUtils.buildEntry(testFiles);
      karmakWatcher._writeEntry(
        baseDir, entryContent, callback.bind(null, testFiles)
      );
    });
  },

  /**
   * Starts fs watching.
   * @param {string} baseDir
   * @param {string[]} patterns
   * @param {string[]} testFiles
   * @param {function} callback
   */
  _startFsWatching: function(baseDir, patterns, testFiles, callback) {
    var files = testFiles.slice();

    fsWatcher.watch({
      path: baseDir,
      catchupDelay: 100,

      listener: function(event, filename) {
        if (!karmakWatcherUtils.fileMatches(filename, patterns)) return;

        switch (event) {
          case 'create':
            karmakWatcher._log('File added: ' + filename);
            files = karmakWatcher._handleAdd(files, filename);
            break;

          case 'delete':
            karmakWatcher._log('File deleted: ' + filename);
            files = karmakWatcher._handleDelete(files, filename);
            break;

          default:
            return;
        }

        var entryContent = karmakWatcherUtils.buildEntry(files);
        karmakWatcher._writeEntry(baseDir, entryContent);
      },

      next: function(err, fsListener) {
        if (fsListener.state == 'active') {
          callback(fsListener.close.bind(fsListener));
        }
      }
    });
  },

  /**
   * Writes given content to entry file.
   * @param {string} baseDir
   * @param {string} entryContent
   * @param {function?} callback
   */
  _writeEntry: function(baseDir, entryContent, callback) {
    karmakWatcher._log('Building entry file...');
    karmakWatcherUtils.writeEntry(
      path.join(baseDir, 'tmp', 'karmak_entry.js'),
      entryContent,
      function() {
        karmakWatcher._log('... done');
        if (callback) callback.apply(this, arguments);
      }
    );
  },

  /**
   * Handles file add event.
   * @param {string[]} files
   * @param {string} filename
   * @returns {string[]} updated files list
   */
  _handleAdd: function(files, filename) {
    return karmakWatcherUtils.sortFiles(files.concat([filename]));
  },

  /**
   * Handles file delete event.
   * @param {string[]} files
   * @param {string} filename
   * @returns {string[]} updated files list
   */
  _handleDelete: function(files, filename) {
    return karmakWatcherUtils.excludeFile(files, filename);
  },

  /**
   * Posts to log as "watcher" process
   * @param {string} message
   */
  _log: function(message) {
    logger.log('watcher', message);
  }
};

module.exports = karmakWatcher;

