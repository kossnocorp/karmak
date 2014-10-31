var path = require('path');
var minimatch = require('minimatch');
var watchFs = require('glob-watcher');
var readdir = require('recursive-readdir');
var prettyjson = require('prettyjson');
var Promise = require('bluebird');
var logger = require('./../logger');
var karmakWatcherUtils = require('./watcher_utils');
var once = require('lodash-node/modern/functions/once');

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
    karmakWatcher._log('Starting up');

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
            karmakWatcher._log('Running single run');
            if (options.onReady) options.onReady();

          } else {
            karmakWatcher._log('Running watch mode');
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
    karmakWatcher._log('Reading initial files list');
    readdir(baseDir, function(err, files) {
      var testFiles = karmakWatcherUtils.sortFiles(files.filter(function(filename) {
        return karmakWatcherUtils.fileMatches(
          path.relative(baseDir, filename), patterns
        );
      }));
      karmakWatcher._log(testFiles.length + ' files found');

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
    karmakWatcher._log('Starting FS watcher');

    var files = testFiles.slice();

    var fsWatcher = watchFs(patterns);

    fsWatcher.on('ready', once(function(watcher) {
      karmakWatcher._log('FS watcher is ready');
      callback(watcher.close.bind(watcher));
    }));

    var buildEntry = function() {
      var entryContent = karmakWatcherUtils.buildEntry(files);
      karmakWatcher._writeEntry(baseDir, entryContent);
    };

    fsWatcher.on('change', function(e) {
      var filename = e.path;

      switch (e.type) {
        case 'added':
          karmakWatcher._log('File added: ' + filename);
          files = karmakWatcher._handleAdd(files, filename);
          buildEntry();
          break;

        case 'deleted':
          karmakWatcher._log('File deleted: ' + filename);
          files = karmakWatcher._handleDelete(files, filename);
          buildEntry();
          break;
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
    karmakWatcher._log('Writing entry file');

    karmakWatcherUtils.writeEntry(
      path.join(baseDir, 'tmp', 'karmak_entry.js'),
      entryContent,
      function() {
        karmakWatcher._log('Entry file is ready');
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
   * @param {number?} level
   */
  _log: logger.log.bind(null, 'watcher'),

  /**
   * Posts error to log as "watcher" process
   * @param {string} message
   */
  _error: logger.error.bind(null, 'watcher')
};

module.exports = karmakWatcher;

