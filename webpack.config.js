const webpack = require('webpack');
const path = require('path');

module.exports = [{
  entry: './lib/dist-index.js',
  output: {
    libraryTarget: 'this',
    filename: 'bem-names.js',
    path: path.resolve(__dirname, 'dist'),
  },
}, {
  entry: './lib/dist-index.js',
  output: {
    libraryTarget: 'this',
    filename: 'bem-names.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
}];
