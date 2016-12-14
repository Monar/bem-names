'use strict';
/* eslint-disable */

const webpack = require("webpack");

module.exports = {
  entry: "./index.js",
  output: {
    library: "bemNames",
    libraryTarget: "commonjs-module",
    path: __dirname + "/dist",
    filename: "index.js",
  },
};
