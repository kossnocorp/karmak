var matcher = require('../matcher');

describe('matcher', function() {
  describe('.isTestHelper', function() {
    it('returns true for test_helper.js', function() {
      expect(matcher.isTestHelper('test_helper.js')).to.be.true;
    });

    it('returns true for test-helper.js', function() {
      expect(matcher.isTestHelper('test-helper.js')).to.be.true;
    });

    it('returns true for spec_helper.js', function() {
      expect(matcher.isTestHelper('spec_helper.js')).to.be.true;
    });

    it('returns true for spec-helper.js', function() {
      expect(matcher.isTestHelper('spec-helper.js')).to.be.true;
    });

    it('allows to put underscore in start of file name', function() {
      expect(matcher.isTestHelper('_test_helper.js')).to.be.true;
    });

    it('allows to pass full path', function() {
      expect(matcher.isTestHelper('./../test/test_helper.js')).to.be.true;
    });

    it('returns false for everything rest', function() {
      expect(matcher.isTestHelper('testus_helperus.js')).to.be.false;
    });
  });

  describe('.isTest', function() {
    it('returns true for *_test.js', function() {
      expect(matcher.isTestFile('something_test.js')).to.be.true;
    });

    it('returns true for *-test.js', function() {
      expect(matcher.isTestFile('something-test.js')).to.be.true;
    });

    it('returns true for *_spec.js', function() {
      expect(matcher.isTestFile('something_spec.js')).to.be.true;
    });

    it('returns true for *-spec.js', function() {
      expect(matcher.isTestFile('something-spec.js')).to.be.true;
    });

    it('allows to pass full path', function() {
      expect(matcher.isTestFile('./../test/something_test.js')).to.be.true;
    });

    it('returns false for everything rest', function() {
      expect(matcher.isTestFile('something_testus.js')).to.be.false;
    });
  });
});

