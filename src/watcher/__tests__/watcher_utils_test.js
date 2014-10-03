var rewire = require('rewire');
var karmakWatcheUtils = rewire('../watcher_utils');
var fs = require('fs');
var rimraf = require('rimraf');
var minimatch = require('minimatch')
var touch = require('touch');

describe('karmakWatcheUtils', function() {
  beforeEach(function() {
    this.originCwd = process.cwd();
    process.chdir(__dirname);
  });

  afterEach(function(done) {
    process.chdir(this.originCwd);
    rimraf(__dirname + '/tmp', function() {
      done();
    });
  });

  describe('.buildEntry', function() {
    it('builds entry point content', function() {
      var result = karmakWatcheUtils.buildEntry(['a', 'b', 'c']);
      expect(result).to.be.eql(
        "require('a');\n" +
        "require('b');\n" +
        "require('c');\n"
      );
    });
  });

  describe('.writeEntry', function() {
    beforeEach(function(done) {
      fs.mkdir(__dirname + '/tmp', function() {
        done();
      });
    });

    it('writes entry point content', function(done) {
      var filename = __dirname + '/tmp/test';
      karmakWatcheUtils.writeEntry(filename, "it\nworks", function() {
        fs.readFile(filename, function(err, data) {
          expect(data.toString()).to.be.eql("it\nworks");
          done();
        });
      });
    });
  });

  describe('.ensureTmpDir', function() {
    it('creates tmp dir in given path', function(done) {
      karmakWatcheUtils.ensureTmpDir(__dirname + '/', function() {
        fs.stat(__dirname + '/tmp', function(err, stats) {
          expect(stats.isDirectory()).to.be.true;
          done();
        });
      });
    });

    it('do not fails if dir is already exists', function(done) {
      fs.mkdir(__dirname + '/tmp', function() {
        karmakWatcheUtils.ensureTmpDir(__dirname + '/', function() {
          done();
        });
      });
    });
  });

  describe('.dirFor', function() {
    it('returns dir for file', function() {
      expect(karmakWatcheUtils.dirFor('/Users/koss/src/test/lib/b/test.js')).to.be.eql(
        '/Users/koss/src/test/lib/b/'
      );
    });

    it('returns dir if dir name is passed', function() {
      expect(karmakWatcheUtils.dirFor('/Users/koss/src/test/lib/b/')).to.be.eql(
        '/Users/koss/src/test/lib/b/'
      );
    });
  });

  describe('.sortFiles', function() {
    it('sorts files by dirs', function() {
      var result = karmakWatcheUtils.sortFiles([
        'dir/_a.js',
        'dir/b.js',
        'dir/b/C.js',
        'dir/b/B.js',
        'dir/c.js'
      ]);
      expect(result).to.be.eql([
        'dir/_a.js',
        'dir/b.js',
        'dir/c.js',
        'dir/b/B.js',
        'dir/b/C.js'
      ]);
    });

    it('sorts files by name in proper way', function() {
      var result = karmakWatcheUtils.sortFiles([
        'dir/_a.js',
        'dir/b.js',
        'dir/b/file3_test.js',
        'dir/b/file2_test.js',
        'dir/b/file_test.js',
        'dir/c.js'
      ]);
      expect(result).to.be.eql([
        'dir/_a.js',
        'dir/b.js',
        'dir/c.js',
        'dir/b/file_test.js',
        'dir/b/file2_test.js',
        'dir/b/file3_test.js'
      ]);
    });

    it('sorts dirs by name in proper way', function() {
      var result = karmakWatcheUtils.sortFiles([
        'dir/test2_dir/dir2_test.js',
        'dir/test_dir/dir_test.js',
        'dir/test3_dir/dir3_test.js'
      ]);
      expect(result).to.be.eql([
        'dir/test_dir/dir_test.js',
        'dir/test2_dir/dir2_test.js',
        'dir/test3_dir/dir3_test.js'
      ]);
    });

    it('process any number of undescores (affects sorting)', function() {
      var result = karmakWatcheUtils.sortFiles([
        '/Users/koss/src/karmak/src/__tests__/_fixtures/example/src/__tests__/file2_test.js',
        '/Users/koss/src/karmak/src/__tests__/_fixtures/example/src/__tests__/file_test.js'
      ]);
      expect(result).to.be.eql([
        '/Users/koss/src/karmak/src/__tests__/_fixtures/example/src/__tests__/file_test.js',
        '/Users/koss/src/karmak/src/__tests__/_fixtures/example/src/__tests__/file2_test.js'
      ]);
    });

    it('keeps original array not muted', function() {
      var origin = [
        'dir/test2_dir/dir2_test.js',
        'dir/test_dir/dir_test.js',
        'dir/test3_dir/dir3_test.js'
      ];
      var originCopy = origin.slice();
      var result = karmakWatcheUtils.sortFiles(origin);
      expect(origin).to.be.eql(originCopy);
    });
  });

  describe('.excludeDir', function() {
    it('removes files from passed dir', function() {
      var result = karmakWatcheUtils.excludeDir([
        '/Users/koss/src/express/lib/application.js',
        '/Users/koss/src/express/lib/express.js',
        '/Users/koss/src/express/lib/request.js',
        '/Users/koss/src/express/lib/response.js',
        '/Users/koss/src/express/lib/utils.js',
        '/Users/koss/src/express/lib/view.js',
        '/Users/koss/src/express/lib/middleware/init.js',
        '/Users/koss/src/express/lib/middleware/query.js',
        '/Users/koss/src/express/lib/router/index.js',
        '/Users/koss/src/express/lib/router/layer.js',
        '/Users/koss/src/express/lib/router/match.js',
        '/Users/koss/src/express/lib/router/route.js',
        '/Users/koss/src/express/lib/router/test/file.js'
      ], '/Users/koss/src/express/lib/router/');
      expect(result).to.be.eql([
        '/Users/koss/src/express/lib/application.js',
        '/Users/koss/src/express/lib/express.js',
        '/Users/koss/src/express/lib/request.js',
        '/Users/koss/src/express/lib/response.js',
        '/Users/koss/src/express/lib/utils.js',
        '/Users/koss/src/express/lib/view.js',
        '/Users/koss/src/express/lib/middleware/init.js',
        '/Users/koss/src/express/lib/middleware/query.js'
      ]);
    });
  });

  describe('.excludeFile', function() {
    it('excludes file from array', function() {
      var files = [
        '/Users/koss/src/express/lib/application.js',
        '/Users/koss/src/express/lib/express.js',
        '/Users/koss/src/express/lib/request.js',
        '/Users/koss/src/express/lib/response.js',
        '/Users/koss/src/express/lib/utils.js',
        '/Users/koss/src/express/lib/view.js',
        '/Users/koss/src/express/lib/middleware/init.js',
        '/Users/koss/src/express/lib/middleware/query.js'
      ];
      var result = karmakWatcheUtils.excludeFile(
        files, '/Users/koss/src/express/lib/view.js'
      );
      expect(result).to.be.eql([
        '/Users/koss/src/express/lib/application.js',
        '/Users/koss/src/express/lib/express.js',
        '/Users/koss/src/express/lib/request.js',
        '/Users/koss/src/express/lib/response.js',
        '/Users/koss/src/express/lib/utils.js',
        '/Users/koss/src/express/lib/middleware/init.js',
        '/Users/koss/src/express/lib/middleware/query.js'
      ])
    });
  });

  describe('.fileMatches', function() {
    it('returns true if path matches passed patterns', function() {
      var result = karmakWatcheUtils.fileMatches('test_test.js', ['**/*_test.js']);
      expect(result).to.be.true;
    });

    it('allows to pass single pattern', function() {
      var result = karmakWatcheUtils.fileMatches('test_test.js', '**/*_test.js');
      expect(true).to.be.true;
    });

    it('returns false for not matching filename', function() {
      var result = karmakWatcheUtils.fileMatches('test_test.js', '**/_test_helper.js');
      expect(result).to.be.false;
    });

    it('allows to specify ignore patterns', function() {
      var result = karmakWatcheUtils.fileMatches(
        'src/test_test.js', ['**/*_test.js', '!node_modules/**/*']
      );
      expect(result).to.be.true;
    });

    it('returns false if ignore pattern has been matched', function() {
      var result = karmakWatcheUtils.fileMatches(
        'node_modules/test_test.js', ['**/*_test.js', '!node_modules/**/*']
      );
      expect(result).to.be.false;
    });

    it('returns false if only ignore pattern not matched', function() {
      var result = karmakWatcheUtils.fileMatches(
        'whatever.js', ['**/*_test.js', '!node_modules/**/*']
      );
      expect(result).to.be.false;
    });
  });
});

