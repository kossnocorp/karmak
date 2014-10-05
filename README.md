# Karma + webpack - lot of code = Karmak
[![Build Status](https://travis-ci.org/kossnocorp/karmak.svg)](https://travis-ci.org/kossnocorp/karmak)

**Warning:** currently Karmak is not tested well on different enviorments.
It works for my project, but may not play well for your's. Please open issue
if you have problems.

## Installation

``` sh
npm install --save-dev karmak
```

## Usage

### CLI

`./node_modules/.bin/karmak --help`:
```
  Usage: karmak [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    --single-run             signle run? (false)
    --webpack-config <path>  webpack config path (./webpack.config.js)
    --karma-config <path>    Karma config path (./karma.conf.js)
    --pattern <pattern>      test files patterns (['**/*/_test_helper.js', '**/*_test.js', '!node_modules/**/*'])
    --env                    NODE_ENV ('test' if undefined)
```

### Preparation

Remove test patterns from Karma's `files` array and replace it with
`--pattern` arguments.

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

