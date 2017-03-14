const webpack = require('webpack');

module.exports = [{
  entry: './lib/index.js',
  output: {
    libraryTarget: 'this',
    filename: 'bem-names.js',
    path: './dist',
  },
}, {
  entry: './lib/index.js',
  output: {
    libraryTarget: 'this',
    filename: 'bem-names.min.js',
    path: './dist',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
}];
