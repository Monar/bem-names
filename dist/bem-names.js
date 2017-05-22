(function(e, a) { for(var i in a) e[i] = a[i]; }(this, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bemNamesEnums = exports.bemNamesFactory = exports.customBemNames = exports.bemNames = undefined;

var _bemNames = __webpack_require__(1);

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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.bemNames = bemNames;
exports.bemNamesFactory = bemNamesFactory;
exports.customBemNames = customBemNames;
exports.customBemNamesInner = customBemNamesInner;
exports.applyMods = applyMods;
exports.applyStyles = applyStyles;
exports.extractModifiers = extractModifiers;
exports.defaultParseModifier = defaultParseModifier;
/*
  Copyright (C) 2016 Piotr Tomasz Monarski.
  Licensed under the MIT License (MIT), see
  https://github.com/Monar/bem-names
*/

var StringModifiers = exports.StringModifiers = {
  WARN: 'warn',
  ALLOW: 'allow',
  PASS_THROUGH: 'passThrough'
};

var StylesPolicy = exports.StylesPolicy = {
  WARN: 'warn',
  IGNORE: 'ignore'
};

var defaultConfig = exports.defaultConfig = {
  separators: { element: '__', modifier: '--', keyValue: '-' },
  states: {},
  styles: undefined,
  stylesPolicy: StylesPolicy.WARN,
  joinWith: ' ',
  bemLike: true,
  keyValue: false,
  stringModifiers: StringModifiers.WARN,
  parseModifier: defaultParseModifier
};

function bemNames() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return customBemNamesInner(defaultConfig, args[0], args.slice(1));
}

function bemNamesFactory(block) {
  var customConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var config = _extends({}, defaultConfig, customConfig, {
    separators: _extends({}, defaultConfig.separators, customConfig.separators)
  });

  if (config.bemLike && !isString(block)) {
    console.error('block name: "' + block + '" is not a string');
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return customBemNamesInner(config, block, args);
  };
}

function customBemNames(customConfig, block) {
  var config = _extends({}, defaultConfig, customConfig, {
    separators: _extends({}, defaultConfig.separators, customConfig.separators)
  });

  for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  return customBemNamesInner(config, block, args);
}

function customBemNamesInner(config, block) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (config.bemLike && isString(args[0])) {
    var bemName = block + config.separators.element + args.shift();
    return applyMods(config, bemName, args);
  } else if (!config.bemLike) {
    return applyMods(config, undefined, [block].concat(args));
  }

  return applyMods(config, block, args);
}

function applyMods(config, bemName, modifiers) {
  var bemLike = config.bemLike,
      parseModifier = config.parseModifier,
      joinWith = config.joinWith,
      stringModifiers = config.stringModifiers,
      styles = config.styles,
      stylesPolicy = config.stylesPolicy;

  var toExtract = modifiers;
  var toPass = [];

  if (bemLike && stringModifiers === StringModifiers.PASS_THROUGH) {
    toPass = modifiers.filter(isString);
  }

  var extracted = toExtract.reduce(extractModifiers(config), []);

  var parsed = extracted;
  var toJoin = parsed;

  if (bemLike) {
    parsed = parsed.map(function (mod) {
      return parseModifier(config, bemName, mod);
    });
    toJoin = [bemName].concat(parsed, toPass);
  }

  if (styles != undefined) {
    toJoin = applyStyles(toJoin, styles, stylesPolicy);
  }

  return toJoin.join(joinWith);
}

function applyStyles(toJoin, styles, stylesPolicy) {
  if (stylesPolicy === StylesPolicy.WARN) {
    var _fn = function _fn(acc, key) {
      if (key in styles) {
        acc.push(styles[key]);
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn('Key ' + key + ' is missing in styles');
      }
      return acc;
    };
    return toJoin.reduce(_fn, []);
  }

  var stylePolicyIsWarn = stylesPolicy !== StylesPolicy.WARN;
  if (stylePolicyIsWarn && process.env.NODE_ENV !== 'production') {
    console.warn('StylePolicy: "' + stylesPolicy + '" has invalid value');
  }

  var fn = function fn(acc, key) {
    return key in styles ? acc.push(styles[key]) && acc : acc;
  };
  return toJoin.reduce(fn, []);
}

function extractModifiers(config) {
  var keyValueSep = config.separators.keyValue;
  return function (extracted, modifiers) {
    if (Array.isArray(modifiers)) {
      return extracted.concat(modifiers);
    }

    if ((typeof modifiers === 'undefined' ? 'undefined' : _typeof(modifiers)) == 'object' && modifiers !== null) {
      var objecExtrac = function objecExtrac(k) {
        return !!modifiers[k] && extracted.push(k);
      };

      if (config.bemLike && config.keyValue) {
        objecExtrac = function objecExtrac(key) {
          var value = modifiers[key];
          if (value === true) {
            extracted.push(key);
          } else if (value) {
            extracted.push(key + keyValueSep + value);
          }
        };
      }

      Object.keys(modifiers).forEach(objecExtrac);
      return extracted;
    }

    var strWarn = config.stringModifiers == StringModifiers.WARN;
    if (config.bemLike && strWarn && process.env.NODE_ENV !== 'production') {
      console.warn('Provided modifier "' + modifiers + '" is now allowed!');
      return extracted;
    }

    if (!config.bemLike || config.stringModifiers == StringModifiers.ALLOW) {
      extracted.push(modifiers);
    }

    return extracted;
  };
}

function isString(str) {
  return typeof str == 'string' || str instanceof String;
}

function defaultParseModifier(config, bemName, modifier) {
  if (modifier in config.states) {
    return config.states[modifier];
  }

  return bemName + config.separators.modifier + modifier;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = __webpack_require__(0);

Object.defineProperty(exports, 'bemNames', {
  enumerable: true,
  get: function get() {
    return _.bemNames;
  }
});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ])));