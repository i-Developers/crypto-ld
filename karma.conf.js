/**
 * Karam configuration for crypto-ld.
 *
 * Copyright (c) 2011-2019 Digital Bazaar, Inc. All rights reserved.
 */
module.exports = function(config) {
  // bundler to test: webpack, browserify
  var bundler = process.env.BUNDLER || 'webpack';

  var frameworks = ['mocha'];
  // main bundle preprocessors
  var preprocessors = ['babel'];

  if(bundler === 'browserify') {
    frameworks.push(bundler);
    preprocessors.push(bundler);
  } else if(bundler === 'webpack') {
    preprocessors.push(bundler);
    preprocessors.push('sourcemap');
  } else {
    throw Error('Unknown bundler');
  }

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: frameworks,

    // list of files / patterns to load in the browser
    files: [
      './tests/test-karma.js',
      {
        pattern: 'tests/*.spec.js',
        watched: false, served: true, included: true
      }
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      //'tests/*.js': ['webpack', 'babel'] //preprocessors
      'tests/*.js': preprocessors
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            include: [{
              // exclude node_modules by default
              exclude: /(node_modules)/
            }],
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: [
                  [
                    '@babel/plugin-proposal-object-rest-spread',
                    {useBuiltIns: true}
                  ],
                  '@babel/plugin-transform-modules-commonjs',
                  '@babel/plugin-transform-runtime'
                ]
              }
            }
          }
        ]
      },
      node: {
        Buffer: true,
        process: false,
        crypto: false,
        setImmediate: false
      },
      resolve: {
        alias: {
          'forge': require.resolve('node-forge')
        }
      }
    },

    browserify: {
      debug: true
      //transform: ['uglifyify']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    //reporters: ['progress'],
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['ChromeHeadless', 'Chrome', 'Firefox', 'Safari'],
    browsers: ['ChromeHeadless'],

    customLaunchers: {
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      },
      IE8: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE8'
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // Mocha
    client: {
      mocha: {
        // increase from default 2s
        timeout: 10000,
        reporter: 'html'
        //delay: true
      }
    },

    // Proxied paths
    proxies: {}
  });
};
