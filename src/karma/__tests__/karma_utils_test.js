var path = require('path');
var objectAssign = require('object-assign');
var karmakKarmaUtils = require('../karma_utils');

describe('karmakKarmaUtils', function() {
  var baseDir = path.join(__dirname, '_fixtures/');

  describe('.readConfig', function() {
    beforeEach(function() {
      this.originCwd = process.cwd();
      process.chdir(path.join(baseDir, 'example'));
    });

    afterEach(function() {
      process.chdir(this.originCwd);
    });

    it('reads Karma config in default place', function() {
      var result = karmakKarmaUtils.readConfig();
      expect(result.placement).to.be.eql('default');
    });

    it('allows to override base dir', function() {
      var result = karmakKarmaUtils.readConfig({
        baseDir: path.join(process.cwd(), '/dir/')
      });
      expect(result.placement).to.be.eql('custom dir');
    });

    it('allows to specify custom config file name', function() {
      var result = karmakKarmaUtils.readConfig({
        path: path.join(process.cwd(), '/dir/custom_karma_config')
      });
      expect(result.placement).to.be.eql('custom file');
    });

    it('resolves relative path', function() {
      var result = karmakKarmaUtils.readConfig({
        baseDir: process.cwd(),
        path: './dir/custom_karma_config'
      });
      expect(result.placement).to.be.eql('custom file');
    });
  });

  describe('.generateConfig', function() {
    it('generates basic Karma config', function() {
      var result = karmakKarmaUtils.generateConfig(baseDir);
      expect(result).to.be.eql({
        basePath: baseDir,
        files: [],
        browsers: ['PhantomJS']
      });
    });
  });

  describe('.injectConfig', function() {
    var config = {
      basePath: baseDir,
      files: [],
      browsers: ['PhantomJS']
    };

    it('adds karmak tests path', function() {
      var configWithFiles = objectAssign({}, config);
      configWithFiles['files'] = [1, 2, 3];

      var result = karmakKarmaUtils.injectConfig(configWithFiles, baseDir);
      expect(result).to.be.eql({
        basePath: baseDir,
        files: [1, 2, 3, './tmp/karmak_tests.js'],
        browsers: ['PhantomJS']
      });
    });

    it('adds karmak tests path', function() {
      var configWithoutFiles = objectAssign({}, config);
      delete configWithoutFiles['files'];

      var result = karmakKarmaUtils.injectConfig(configWithoutFiles, baseDir);
      expect(result).to.be.eql({
        basePath: baseDir,
        files: ['./tmp/karmak_tests.js'],
        browsers: ['PhantomJS']
      });
    });


    it('overrides baseDir', function() {
      var configWithBasePath = objectAssign({}, config);
      configWithBasePath['basePath'] = '..';

      var result = karmakKarmaUtils.injectConfig(configWithBasePath, baseDir);
      expect(result).to.be.eql({
        basePath: baseDir,
        files: ['./tmp/karmak_tests.js'],
        browsers: ['PhantomJS']
      });
    });
  });
});

