var webpack = require('webpack');

module.exports = function (config) {
  config.set({

    browsers: ['PhantomJS'],

    singleRun: !!process.env.CI,

    frameworks: [ 'mocha' ],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      process.env.WEBPACK_DLLS === '1' && './static/dist/dlls/dll__vendor.js',
      'tests.webpack.js'
    ].filter(function(x) { return !!x; }),

    port: 9876,

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    reporters: [ 'mocha', 'coverage' ],

    coverageReporter: {
      type: !!process.env.CI ? 'text' : 'lcov', dir: 'coverage/'
    },

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-sourcemap-loader"),
      require('karma-coverage'),
    ],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 10240} },
          { test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.less$/, loader: 'style!css!less' },
          { test: /\.scss$/, loader: 'style!css!sass' }
        ],
        noParse: [
          /\/sinon\.js/, //Dont parse so it could be es6 imported until 2.x comes out
        ],
      },
      externals: {
        'jsdom': 'window',
        'cheerio': 'window',
        "react/lib/ExecutionEnvironment": true,
        "react/lib/ReactContext": true,
        'react/addons': true
      },
      resolve: {
        modulesDirectories: [
          'src',
          'src/redux/modules/__tests__',
          'node_modules'
        ],
        extensions: ['', '.json', '.js'],
        alias: {
          sinon: 'sinon/pkg/sinon', //Alias to use es6 import from 'sinon' until 2.x comes out
        },
      },
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DEVTOOLS__: false,  // <-------- DISABLE redux-devtools HERE
          __DLLS__: process.env.WEBPACK_DLLS === '1'
        })
      ]
    },

    webpackServer: {
      noInfo: true
    }

  });
};
