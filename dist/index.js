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
/* harmony export (immutable) */ exports["a"] = bemNamesFactory;
/* harmony export (immutable) */ exports["b"] = bemNames;
/* harmony export (immutable) */ exports["c"] = customBemNames;
/* unused harmony export applyMods */
/* unused harmony export parseModifier */
/* unused harmony export extractModifier */
/* unused harmony export flatMap */
const defaultSeparators = { element: '__', modifier: '--' };
function bemNamesFactory(
  block,
  states = {},
  separators = defaultSeparators
){
  const config = { block, states, separators };
  if (block === undefined) {
    return (...args) => customBemNames(config, ...args);
  }

  return (...args) => customBemNames(config, block, ...args);
}

function bemNames(...args) {
  const config = { states: {}, separators: defaultSeparators };
  return customBemNames(config, ...args);
}

function customBemNames(config, block, ...args) {
  let bemNames = block;

  if (isString(args[0])) {
    bemNames = block + config.separators.element + args[0];
    return applyMods(config, bemNames, args.slice(1));
  }

  return applyMods(config, bemNames, args);
}

function applyMods(config, bemNames, modifiers) {
  const flattenedModifiers =
    flatMap(modifiers, (mods) => extractModifier(mods));
  const parsedModifiers =
    flattenedModifiers.map((mod) => parseModifier(config, bemNames, mod));
  return [bemNames].concat(parsedModifiers).join(' ');
}

function parseModifier(config, bemNames, modifier) {
  if (modifier in config.states) {
    return config.states[modifier];
  }

  return bemNames + config.separators.modifier + modifier;
}

function extractModifier(modifiers) {
  if (Array.isArray(modifiers)) {
    return modifiers;
  }

  if (typeof modifiers === 'object') {
    return flatMap(modifiers, (val, key) => val ? key : []);
  }

  throw new TypeError(
    `Provided modifiers:${modifiers} are neither an Array nor an Object`
  );
}

function isString(str) {
  return typeof str === 'string' || str instanceof String;
}

function flatMap(colection, fn) {
  let values = [];
  if (Array.isArray(colection)) {
    values = colection.map(fn);
  } else {
    values = Object.keys(colection)
      .map((key) => fn(colection[key], key));
  }

  function flat(result, element) {
    if (Array.isArray(element)) {
      return result.concat(element);
    }
    result.push(element);
    return result;
  }

  return values.reduce(flat, []);
}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bem_names__ = __webpack_require__(0);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "bemNamesFactory", function() { return __WEBPACK_IMPORTED_MODULE_0__bem_names__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "bemNames", function() { return __WEBPACK_IMPORTED_MODULE_0__bem_names__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "customBemNames", function() { return __WEBPACK_IMPORTED_MODULE_0__bem_names__["c"]; });



/* harmony default export */ exports["default"] = __WEBPACK_IMPORTED_MODULE_0__bem_names__["b" /* bemNames */];


/***/ }
/******/ ])
Object.defineProperty(module.exports, "__esModule", { value: true });;