/**
 * @module WebpackOnBuildPlugin
 */

function WebpackOnBuildPlugin(callback) {
  this.callback = callback;
};

WebpackOnBuildPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', this.callback);
};

module.exports = WebpackOnBuildPlugin;

