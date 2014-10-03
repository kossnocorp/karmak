var rewire = require('rewire');
var karmakWebpackUtils = rewire('../webpack_utils');

describe('karmakWebpackUtils', function() {
  describe('.readConfig', function() {
    beforeEach(function() {
      this.originCwd = process.cwd();
      process.chdir(__dirname + '/_fixtures/example');
    });

    afterEach(function() {
      process.chdir(this.originCwd);
    });

    it('reads webpack config in default place', function() {
      var result = karmakWebpackUtils.readConfig();
      expect(result.placement).to.be.eql('default');
    });

    it('allows to override base dir', function() {
      var result = karmakWebpackUtils.readConfig({ baseDir: process.cwd() + '/dir' });
      expect(result.placement).to.be.eql('custom dir');
    });

    it('allows to specify custom config file name', function() {
      var result = karmakWebpackUtils.readConfig(
        { path: process.cwd() + '/dir/custom_webpack_config' }
      );
      expect(result.placement).to.be.eql('custom file');
    });
  });

  describe('.injectConfig', function() {
    it('sets entry point');

    it('adds build plugin');

    it('adds rewire plugin');
  });
});

