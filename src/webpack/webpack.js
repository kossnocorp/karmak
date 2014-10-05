var fs = require('fs');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var express = require('express');
var karmakWebpackUtils = require('./webpack_utils');
var logger = require('../logger');

var SERVER_PORT = 9877;

/**
 * @module karmakWebpack
 */
var karmakWebpack = {
  /**
   * @param {object} options
   * @returns {function} stop build
   */
  build: function(options) {
    karmakWebpack._log('Starting up...');

    options = options || {};

    var webpackConfig = karmakWebpack._getConfig(options);
    var compiler = webpack(webpackConfig);

    if (options.singleRun) {
      compiler.run(function() {});

    } else {
      express()
        .use(webpackMiddleware(compiler, { quiet: true }))
        .listen(SERVER_PORT);
    }
  },

  /**
   * @private
   * Returns webpack config basing on options.
   * @param {object} options
   * @returns {object}
   */
  _getConfig: function(options) {
    var baseDir = options.path || (process.cwd() + '/');

    var webpackConfig = karmakWebpackUtils.readConfig({
      path: options.webpackConfigPath,
      baseDir: baseDir
    });

    var state = { onceBuilded: false };
    return karmakWebpackUtils.injectConfig(
      webpackConfig,
      baseDir,
      karmakWebpack._processBuild.bind(null, baseDir, state, options)
    );
  },

  /**
   * @private
   * @param {string} baseDir
   * @param {object} state
   * @param {object} options
   * @param {object} stats (result of webpack build)
   */
  _processBuild: function(baseDir, state, options, stats) {
    var errors = stats.compilation.errors;

    if (errors.length == 0) {
      karmakWebpack._log('Build completed');
      var source = stats.compilation.assets['js/tests.js']._sourceResult;
      fs.writeFileSync(baseDir + 'tmp/karmak_tests.js', source);

      if (!state.onceBuilded) {
        state.onceBuilded = true;
        if (options.onReady) options.onReady();
      }

    } else {
      karmakWebpack._log('Build failed');

      stats.compilation.errors.forEach(function(error, index) {
        karmakWebpack._error('...');
        karmakWebpack._error((index + 1) + ': ' + error.message);
        karmakWebpack._error('Module: ' + error.module.userRequest);
        karmakWebpack._error("\n" + error.details);
      });
    }
  },

  /**
   * @private
   * Posts to log as "webpack" process
   * @param {string} message
   */
  _log: function(message) {
    logger.log('webpack', message);
  },

  /**
   * @private
   * Posts error to log as "webpack" process
   * @param {string} message
   */
  _error: function(message) {
    logger.error('webpack', message);
  }
};

module.exports = karmakWebpack;

