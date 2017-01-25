'use strict';

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