var path = require('path');
var objectAssign = require('object-assign');
var rewire = require('rewire');
var karmakWebpackUtils = rewire('../webpack_utils');

describe('karmakWebpackUtils', function() {
  var baseDir = path.join(__dirname, '_fixtures/');

  describe('.readConfig', function() {
    beforeEach(function() {
      this.originCwd = process.cwd();
      process.chdir(path.join(__dirname, '_fixtures', 'example'));
    });

    afterEach(function() {
      process.chdir(this.originCwd);
    });

    it('reads webpack config in default place', function() {
      var result = karmakWebpackUtils.readConfig();
      expect(result.placement).to.be.eql('default');
    });

    it('allows to override base dir', function() {
      var result = karmakWebpackUtils.readConfig({ baseDir: process.cwd() + '/dir/' });
      expect(result.placement).to.be.eql('custom dir');
    });

    it('allows to specify custom config file name', function() {
      var result = karmakWebpackUtils.readConfig(
        { path: process.cwd() + '/dir/custom_webpack_config' }
      );
      expect(result.placement).to.be.eql('custom file');
    });

    it('resolves relative path', function() {
      var result = karmakWebpackUtils.readConfig({
        baseDir: process.cwd(),
        path: './dir/custom_webpack_config'
      });
      expect(result.placement).to.be.eql('custom file');
    });
  });

  describe('.generateConfig', function() {
    it('generates basic webpack config', function() {
      var result = karmakWebpackUtils.generateConfig(baseDir);
      expect(result).to.be.eql({
        cache: true,
        context: baseDir,
        resolve: { root: baseDir }
      });
    });
  });

  describe('.injectConfig', function() {
    var config = {
      cache: true,
      context: baseDir,
      resolve: { root: baseDir }
    };

    it('overrides entry point', function() {
      var configWithEntry = objectAssign({}, config);
      configWithEntry['entry'] = { a: 'A' };

      var result = karmakWebpackUtils.injectConfig(config, baseDir);
      expect(result).to.shallowDeepEqual({
        entry: {
          tests: baseDir + 'tmp/karmak_entry.js'
        },
      });
    });

    it('adds build plugin', function() {
      var originPlugin = karmakWebpackUtils.__get__('WebpackOnBuildPlugin');
      karmakWebpackUtils.__set__('WebpackOnBuildPlugin', function(cb) {
        this.callback = cb;
        this.test = true;
      })

      var callback = function() {};
      var result = karmakWebpackUtils.injectConfig(config, baseDir, callback);
      expect(result).to.shallowDeepEqual({
        plugins: [
          { callback: callback, test: true }
        ]
      });

      karmakWebpackUtils.__set__('WebpackOnBuildPlugin', originPlugin);
    });

    it('adds rewire plugin', function() {
      var originPlugin = karmakWebpackUtils.__get__('WebpackRewirePlugin');
      karmakWebpackUtils.__set__('WebpackRewirePlugin', function() {
        this.test = true;
      })

      var callback = function() {};
      var result = karmakWebpackUtils.injectConfig(config, baseDir);
      expect(result).to.shallowDeepEqual({
        plugins: [
          {},
          { test: true }
        ]
      });

      karmakWebpackUtils.__set__('WebpackRewirePlugin', originPlugin);
    });

    it('keeps original plugins list', function() {
      var configWithPlugins = objectAssign({ plugins: [42, 43] }, config);
      var result = karmakWebpackUtils.injectConfig(configWithPlugins, baseDir);
      expect(result).to.shallowDeepEqual({
        plugins: [
          42, 43, {}, {}
        ]
      });
    });
  });

  describe('.formatErrors', function() {
    it('format errors for printing');
  });
});

