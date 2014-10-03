var logger = require('../logger');

describe('logger', function() {
  describe('log', function() {
    it('calls console.log with process string and given message', function() {
      sinon.stub(console, 'log');
      logger.log('webpack', 'Building tests');
      expect(console.log).to.be.calledWith(
        '\u001b[44m\u001b[37m[WEBPACK]\u001b[39m\u001b[49m: Building tests'
      );
      console.log.restore();
    });
  });

  describe('error', function() {
    it('calls console.log with process string and given message', function() {
      sinon.stub(console, 'log');
      logger.error('webpack', 'Building failed');
      expect(console.log).to.be.calledWith(
        '\u001b[41m\u001b[37m[WEBPACK]\u001b[39m\u001b[49m' +
        '\u001b[31m: Building failed\u001b[39m'
      );
      console.log.restore();
    });
  });

  describe('processStr', function() {
    it('returns colorfied watcher process name', function() {
      var result = logger.processStr('watcher');
      expect(result).to.be.eql(
        '\u001b[46m\u001b[37m[WATCHER]\u001b[39m\u001b[49m'
      );
    });

    it('returns colorfied webpack process name', function() {
      var result = logger.processStr('webpack');
      expect(result).to.be.eql(
        '\u001b[44m\u001b[37m[WEBPACK]\u001b[39m\u001b[49m'
      );
    });

    it('returns colorfied karma process name', function() {
      var result = logger.processStr('karma');
      expect(result).to.be.eql(
        '\u001b[43m\u001b[37m[KARMA]\u001b[39m\u001b[49m'
      );
    });

    it('returns colorfied karmpack process name', function() {
      var result = logger.processStr('karmpack');
      expect(result).to.be.eql(
        '\u001b[40m\u001b[37m[KARMPACK]\u001b[39m\u001b[49m'
      );
    });

    context('when fail is true', function() {
      it('returns process name with red background', function() {
        var result = logger.processStr('karma', true);
        expect(result).to.be.eql(
          '\u001b[41m\u001b[37m[KARMA]\u001b[39m\u001b[49m'
        );
      });
    });
  });
});

