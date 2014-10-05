var rewire = require('rewire');
var karmakWatcher = rewire('../watcher');
var fs = require('fs');
var rimraf = require('rimraf');
var touch = require('touch');

var DISABLE_LOGGER = true;

describe('karmakWatcher', function() {
  beforeEach(function() {
    if (DISABLE_LOGGER) {
      this.originLogger = karmakWatcher.__get__('logger');
      karmakWatcher.__set__('logger', {
        log: function() {},
        error: function() {}
      });
    }

    this.originCwd = process.cwd();
    process.chdir(__dirname);
  });

  afterEach(function(done) {
    if (DISABLE_LOGGER) {
      karmakWatcher.__set__('logger', this.originLogger);
    }

    process.chdir(this.originCwd);
    rimraf(__dirname + '/tmp', function() {
      done();
    });
  });

  describe('.watch', function() {
    var path = __dirname + '/_fixtures/example/';

    afterEach(function(done) {
      rimraf(path + '/tmp', function() {
        done();
      });
    });

    it('builds entry point with initial list of test files', function(done) {
      karmakWatcher.watch({
        path: path,
        onReady: function(close) {
          close();

          fs.readFile(
            path + 'tmp/karmak_entry.js',
            function(err, entryContent) {
              expect(entryContent.toString()).to.be.eql(
                "require('" + path + "src/__tests__/_test_helper.js');\n" +
                "require('" + path + "src/__tests__/file_test.js');\n" +
                "require('" + path + "src/__tests__/file2_test.js');\n" +
                "require('" + path + "test/_test_helper.js');\n" +
                "require('" + path + "test/example_test.js');\n"
              );
              done();
            }
          );
        }
      });
    });

    it('allows to specify patterns', function() {
      karmakWatcher.watch({
        path: path,
        patterns: [
          '**/*/_test_helper.js',
          '!' + 'node_modules/**/*'
        ],
        onReady: function(close) {
          close();

          fs.readFile(
            path + 'tmp/karmak_entry.js',
            function(err, entryContent) {
              expect(entryContent.toString()).to.be.eql(
                "require('" + path + "src/__tests__/_test_helper.js');\n" +
                "require('" + path + "test/_test_helper.js');\n"
              );
              done();
            }
          );
        }
      });
    });

    context('single build', function() {
      /** @todo */
    });

    context('watch mode', function() {
      context('on file create', function() {
        var testPath = path + 'src/__tests__/file4_test.js';
        var testFileOnTopPath = path + 'src/__tests__/__test_test.js';

        afterEach(function(done) {
          fs.unlink(testPath, function() {
            fs.unlink(testFileOnTopPath, function() {
              done();
            });
          });
        });

        it('detects new files', function(done) {
          karmakWatcher.watch({
            path: path,
            onReady: function(close) {
              touch(testPath, {}, function() {
                setTimeout(function() {
                  fs.readFile(
                    path + 'tmp/karmak_entry.js',
                    function(err, entryContent) {
                      expect(entryContent.toString()).to.be.eql(
                        "require('" + path + "src/__tests__/_test_helper.js');\n" +
                        "require('" + path + "src/__tests__/file_test.js');\n" +
                        "require('" + path + "src/__tests__/file2_test.js');\n" +
                        "require('" + path + "src/__tests__/file4_test.js');\n" +
                        "require('" + path + "test/_test_helper.js');\n" +
                        "require('" + path + "test/example_test.js');\n"
                      );
                      close();
                      done();
                    }
                  );
                }, 800);
              });
            }
          });
        });

        it('properly rearranges added files', function(done) {
          karmakWatcher.watch({
            path: path,
            onReady: function(close) {
              touch(testFileOnTopPath, {}, function() {
                setTimeout(function() {
                  fs.readFile(
                    path + 'tmp/karmak_entry.js',
                    function(err, entryContent) {
                      expect(entryContent.toString()).to.be.eql(
                        "require('" + path + "src/__tests__/__test_test.js');\n" +
                        "require('" + path + "src/__tests__/_test_helper.js');\n" +
                        "require('" + path + "src/__tests__/file_test.js');\n" +
                        "require('" + path + "src/__tests__/file2_test.js');\n" +
                        "require('" + path + "test/_test_helper.js');\n" +
                        "require('" + path + "test/example_test.js');\n"
                      );
                      close();
                      done();
                    }
                  );
                }, 800);
              });
            }
          });
        });
      });

      context('on file removal', function() {
        context('single file removal', function() {
          var testPath = path + 'src/__tests__/file3_test.js';

          beforeEach(function(done) {
            touch(testPath, function() {
              done();
            });
          });

          afterEach(function(done) {
            fs.unlink(testPath, function() {
              done();
            });
          });

          it('detects files removal', function(done) {
            karmakWatcher.watch({
              path: path,
              onReady: function(close) {
                fs.unlink(testPath, function() {
                  setTimeout(function() {
                    fs.readFile(
                      path + 'tmp/karmak_entry.js',
                      function(err, entryContent) {
                        expect(entryContent.toString()).to.be.eql(
                          "require('" + path + "src/__tests__/_test_helper.js');\n" +
                          "require('" + path + "src/__tests__/file_test.js');\n" +
                          "require('" + path + "src/__tests__/file2_test.js');\n" +
                          "require('" + path + "test/_test_helper.js');\n" +
                          "require('" + path + "test/example_test.js');\n"
                        );
                        close();
                        done();
                      }
                    );
                  }, 800);
                });
              }
            });
          });
        });

        context('dir removal', function(done) {
          var dirPath = path + 'src/__tests__/_more_tests/';

          beforeEach(function(done) {
            fs.mkdir(dirPath, function(err) {
              touch(dirPath + 'file_test.js', function(err) {
                touch(dirPath + 'file2_test.js', function() {
                  setTimeout(function() {
                    done();
                  }, 800)
                });
              });
            });
          });

          afterEach(function(done) {
            rimraf(dirPath, function() {
              done();
            });
          });

          it('it removes all the files inside of it', function(done) {
            karmakWatcher.watch({
              path: path,
              onReady: function(close) {
                rimraf(dirPath, function() {
                  setTimeout(function() {
                    fs.readFile(
                      path + 'tmp/karmak_entry.js',
                      function(err, entryContent) {
                        expect(entryContent.toString()).to.be.eql(
                          "require('" + path + "src/__tests__/_test_helper.js');\n" +
                          "require('" + path + "src/__tests__/file_test.js');\n" +
                          "require('" + path + "src/__tests__/file2_test.js');\n" +
                          "require('" + path + "test/_test_helper.js');\n" +
                          "require('" + path + "test/example_test.js');\n"
                        );
                        close();
                        done();
                      }
                    );
                  }, 800);
                });
              }
            });
          });
        });
      });
    });
  });
});

