var readWebpackConfig = require('../read_webpack_config');

describe('readWebpackConfig', function() {
  beforeEach(function() {
    this.originCwd = process.cwd();
    process.chdir(__dirname + '/_fixtures/webpack_config');
  });

  afterEach(function() {
    process.chdir(this.originCwd);
  });

  it('reads webpack config in default place', function() {
    var result = readWebpackConfig();
    expect(result.placement).to.be.eql('default');
  });

  it('allows to override base dir', function() {
    var result = readWebpackConfig({ baseDir: process.cwd() + '/dir' });
    expect(result.placement).to.be.eql('custom dir');
  });

  it('allows to specify custom config file name', function() {
    var result = readWebpackConfig(
      { path: process.cwd() + '/dir/custom_webpack_config' }
    );
    expect(result.placement).to.be.eql('custom file');
  });
});

