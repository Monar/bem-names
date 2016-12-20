'use strict';
/* eslint-disable */

const webpack = require("webpack");

module.exports = {
  entry: "./index.js",
  output: {
    library: "bemNames",
    libraryTarget: "commonjs2",
    path: __dirname + "/dist",
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: 'node_modules/'
      }
    ]
  }
};
