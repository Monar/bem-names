module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.bemNames = bemNames;
exports.bemNamesFactory = bemNamesFactory;
exports.customBemNames = customBemNames;
exports.applyMods = applyMods;
exports.extractModifiers = extractModifiers;
exports.defaultParseModifier = defaultParseModifier;
var StringModifiers = exports.StringModifiers = {
  THROW: 'throw',
  WARN: 'warn',
  ALLOW: 'allow',
  PASS_THROUGH: 'passThrough'
};

var StylesPolicy = exports.StylesPolicy = {
  THROW: 'throw',
  WARN: 'warn',
  IGNORE: 'ignore'
};

var defaultConfig = exports.defaultConfig = {
  separators: { element: '__', modifier: '--', keyValue: '-' },
  states: {},
  styles: {},
  stylesPolicy: StylesPolicy.IGNORE,
  joinWith: ' ',
  bemLike: true,
  keyValue: false,
  stringModifiers: StringModifiers.THROW,
  parseModifier: defaultParseModifier
};

function bemNames() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return customBemNames.apply(undefined, [defaultConfig].concat(args));
}

function bemNamesFactory(block) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!isString(block)) {
    throw TypeError('block name: "' + block + '" is not a string');
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return customBemNames.apply(undefined, [config, block].concat(args));
  };
}

function customBemNames(customConfig, block) {
  var separators = Object.assign({}, defaultConfig.separators, customConfig.separators);
  var config = Object.assign({}, defaultConfig, customConfig, { separators: separators });

  for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  if (!config.bemLike) {
    return applyMods(config, '', [block].concat(args));
  }

  if (isString(args[0])) {
    var bemName = block + config.separators.element + args[0];
    return applyMods(config, bemName, args.slice(1));
  }

  return applyMods(config, block, args);
}

function applyMods(config, bemName, modifiers) {
  var parseModifier = config.parseModifier,
      joinWith = config.joinWith,
      stringModifiers = config.stringModifiers,
      styles = config.styles,
      stylesPolicy = config.stylesPolicy;

  var toExtract = modifiers;
  var toPass = [];

  if (stringModifiers === StringModifiers.PASS_THROUGH) {
    toPass = modifiers.filter(function (mod) {
      return isString(mod);
    });
  }

  var extracted = toExtract.reduce(extractModifiers(config), new Set());

  var parsed = Array.from(extracted).map(function (mod) {
    return parseModifier(config, bemName, mod);
  });

  var toJoin = [bemName].concat(parsed, toPass);

  if (stylesPolicy === StylesPolicy.THROW) {
    toJoin = toJoin.map(function (key) {
      if (!(key in styles)) {
        throw new Error('Key ' + key + ' is missing in styles');
      }
      return styles[key];
    });
  } else if (stylesPolicy === StylesPolicy.WARN) {
    toJoin = toJoin.map(function (key) {
      if (!(key in styles)) {
        console.warn('Key ' + key + ' is missing in styles');
        return '';
      }
      return styles[key];
    });
  }

  return toJoin.filter(function (s) {
    return s !== '';
  }).join(joinWith);
}

function extractModifiers(config) {
  return function (extracted, modifiers) {
    if (Array.isArray(modifiers)) {
      modifiers.forEach(function (m) {
        return extracted.add(m);
      });
      return extracted;
    }

    if ((typeof modifiers === 'undefined' ? 'undefined' : _typeof(modifiers)) === 'object') {
      var keys = Object.keys(modifiers).map(function (key) {
        return modifiers[key] ? key : null;
      }).filter(function (val) {
        return val !== null;
      });

      var addModifier = function addModifier(m) {
        return extracted.add(m);
      };

      if (config.keyValue) {
        (function () {
          var sep = config.separators.keyValue;
          addModifier = function addModifier(k) {
            return extracted.add(isBoolean(modifiers[k]) ? k : k + sep + modifiers[k]);
          };
        })();
      }

      keys.forEach(addModifier);
      return extracted;
    }

    if (!isString(modifiers)) {
      throw new TypeError('Provided modifiers: "' + modifiers + '" is not supported');
    }

    switch (config.stringModifiers) {
      case StringModifiers.ALLOW:
        extracted.add(modifiers);
        break;

      case StringModifiers.THROW:
        throw new TypeError('Provided modifier "' + modifiers + '" is now allowed!');

      case StringModifiers.WARN:
        console.warn('Provided modifier "' + modifiers + '" is now allowed!');
        break;

      case StringModifiers.PASS_THROUGH:
        break;
    }

    return extracted;
  };
}

function isString(str) {
  return typeof str === 'string' || str instanceof String;
}

function isBoolean(val) {
  return typeof val === 'boolean' || val instanceof Boolean;
}

function defaultParseModifier(config, bemName, modifier) {
  if (modifier in config.states) {
    return config.states[modifier];
  }

  return bemName + config.separators.modifier + modifier;
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CssModulePolicy = exports.StringModifiers = exports.customBemNames = exports.bemNames = exports.bemNamesFactory = undefined;

var _bemNames = __webpack_require__(0);

exports.bemNamesFactory = _bemNames.bemNamesFactory;
exports.bemNames = _bemNames.bemNames;
exports.customBemNames = _bemNames.customBemNames;
exports.StringModifiers = _bemNames.StringModifiers;
exports.CssModulePolicy = _bemNames.CssModulePolicy;
exports.default = _bemNames.bemNames;

/***/ }
/******/ ]);