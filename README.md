# Karma + webpack - lot of code = Karmak
[![Build Status](https://travis-ci.org/kossnocorp/karmak.svg)](https://travis-ci.org/kossnocorp/karmak)

**Warning:** currently Karmak is not tested well on different enviorments.
It works for my project, but may not play well for your's. Please open issue
if you have problems.


## Usage

### Single run

``` sh
karmak --webpack-config ./config/webpack.js --karma-config ./config/karma.js --pattern 'spec/spec_helper.js' --pattern 'spec/**/*_spec.js*' --single-run
```

### Autotest

``` sh
karmak --webpack-config ./config/webpack.js --karma-config ./config/karma.js --pattern 'spec/spec_helper.js' --pattern 'spec/**/*_spec.js*'
```

## Contribute

### Run tests

``` sh
npm test
```

_* There is few "slow" tests, do not worry about that, it's ok. They are
such slow because of FS interactions._

