'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bemNamesEnums = exports.bemNamesFactory = exports.customBemNames = exports.bemNames = undefined;

var _bemNames = require('./bem-names');

var bemNamesEnums = {
  StringModifiers: _bemNames.StringModifiers,
  StylesPolicy: _bemNames.StylesPolicy
};

_bemNames.bemNames.factory = _bemNames.bemNamesFactory;
_bemNames.bemNames.custom = _bemNames.customBemNames;
_bemNames.bemNames.StringModifiers = _bemNames.StringModifiers;
_bemNames.bemNames.StylesPolicy = _bemNames.StylesPolicy;

exports.bemNames = _bemNames.bemNames;
exports.customBemNames = _bemNames.customBemNames;
exports.bemNamesFactory = _bemNames.bemNamesFactory;
exports.bemNamesEnums = bemNamesEnums;
exports.default = _bemNames.bemNames;