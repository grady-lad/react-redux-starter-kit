require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 1) || 3001;
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: 5 });
var WebpackHelpers = require('./helpers');

var autoprefixer = require('autoprefixer');
var discartDuplicates = require('postcss-discard-duplicates');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}


var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
var reactTransform = null;
for (var i = 0; i < babelLoaderQuery.plugins.length; ++i) {
  var plugin = babelLoaderQuery.plugins[i];
  if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
    reactTransform = plugin;
  }
}

if (!reactTransform) {
  reactTransform = ['react-transform', {transforms: []}];
  babelLoaderQuery.plugins.push(reactTransform);
}

if (!reactTransform[1] || !reactTransform[1].transforms) {
  reactTransform[1] = Object.assign({}, reactTransform[1], {transforms: []});
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module']
});

var webpackConfig = module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      './src/client.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    loaders: [
      createSourceLoader({
        happy: { id: 'jsx' },
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?' + JSON.stringify(babelLoaderQuery)],
      }),
      createSourceLoader({
        happy: { id: 'json' },
        test: /\.json$/,
        loader: 'json-loader',
      }),
      createSourceLoader({
        happy: { id: 'less' },
        test: /\.less$/,
        loaders: ['style', 'css?module&importLoaders=2&sourceMap&localIdentNam=[local]__[hash:base64:5]','postcss', 'less?outputStyle=expanded&sourceMap'],
      }),
      createSourceLoader({
        happy: { id: 'sass' },
        test: /\.scss$/,
        loaders: ['style', 'css?module&importLoaders=2&sourceMap&localIdentNam=[local]__[hash:base64:5]','postcss', 'sass?outputStyle=expanded&sourceMap'],
      }),
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx', '.node']
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true,  // <-------- DISABLE redux-devtools HERE
      __DLLS__: process.env.WEBPACK_DLLS === '1'
    }),
    webpackIsomorphicToolsPlugin.development(),

    createHappyPlugin('jsx'),
    createHappyPlugin('json'),
    createHappyPlugin('less'),
    createHappyPlugin('sass'),
  ],
  postcss: function() {
    return [autoprefixer({ browsers: ['last 2 versions'] }), discartDuplicates]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  }
};

if (process.env.WEBPACK_DLLS === '1') {
  WebpackHelpers.installVendorDLL(webpackConfig, 'vendor');
}

// restrict loader to files under /src
function createSourceLoader(spec) {
  return Object.keys(spec).reduce(function(x, key) {
    x[key] = spec[key];

    return x;
  }, {
    include: [ path.resolve(__dirname, '../src'), path.resolve(__dirname, '../server'), path.resolve(__dirname, '../node_modules') ]
  });
}

function createHappyPlugin(id) {
  return new HappyPack({
    id: id,
    threadPool: happyThreadPool,

    // disable happypack with HAPPY=0
    enabled: process.env.HAPPY !== '0',

    // disable happypack caching with HAPPY_CACHE=0
    cache: process.env.HAPPY_CACHE !== '0',

    // make happypack more verbose with HAPPY_VERBOSE=1
    verbose: process.env.HAPPY_VERBOSE === '1',
  });
}
