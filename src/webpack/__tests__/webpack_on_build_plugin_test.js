var WebpackOnBuildPlugin = require('../webpack_on_build_plugin');

describe('WebpackOnBuildPlugin', function() {
  it('saves passed callback', function() {
    var fn = function() {};
    var plugin = new WebpackOnBuildPlugin(fn);
    expect(plugin.callback).to.be.eq(fn);
  });
});

