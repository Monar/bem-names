export const StringModifiers = {
  THROW: 'throw',
  WARN: 'warn',
  ALLOW: 'allow',
  PASS_THROUGH: 'passThrough',
};


export const StylesPolicy = {
  THROW: 'throw',
  WARN: 'warn',
  IGNORE: 'ignore',
};


export const defaultConfig = {
  separators: { element: '__', modifier: '--', keyValue: '-' },
  states: {},
  styles: undefined,
  stylesPolicy: StylesPolicy.WARN,
  joinWith: ' ',
  bemLike: true,
  keyValue: false,
  stringModifiers: StringModifiers.WARN,
  parseModifier: defaultParseModifier,
};

export function bemNames(...args) {
  return customBemNamesInner(defaultConfig, args[0], args.slice(1));
}


export function bemNamesFactory(block, customConfig={}){
  if (!isString(block)) {
    throw TypeError(`block name: "${block}" is not a string`);
  }

  const config = {
    ...defaultConfig,
    ...customConfig,
    separators: { ...defaultConfig.separators, ...customConfig.separators },
  };

  return (...args) => customBemNamesInner(config, block, args);
}


export function customBemNames(customConfig, block, ...args) {
  const config = {
    ...defaultConfig,
    ...customConfig,
    separators: { ...defaultConfig.separators, ...customConfig.separators },
  };

  return customBemNamesInner(config, block, args);
}


export function customBemNamesInner(config, block, args=[]) {
  if (!config.bemLike) {
    return applyMods(config, '', [block].concat(args));
  }

  if (isString(args[0])) {
    const bemName = block + config.separators.element + args.shift();
    return applyMods(config, bemName, args);
  }

  return applyMods(config, block, args);
}

export function applyMods(config, bemName, modifiers) {
  const {
    parseModifier,
    joinWith,
    stringModifiers,
    styles,
    stylesPolicy,
  } = config;
  let toExtract = modifiers;
  let toPass = [];

  if (stringModifiers === StringModifiers.PASS_THROUGH) {
    toPass = modifiers.filter(isString);
  }

  const extracted = toExtract.reduce(extractModifiers(config), {});

  const parsed = Object.keys(extracted).map(
    (mod) => parseModifier(config, bemName, mod)
  );

  let toJoin = [];
  if (bemName === '') {
    toJoin = toJoin.concat(parsed, toPass);
  } else {
    toJoin = [bemName].concat(parsed, toPass);
  }

  if (styles != undefined) {
    toJoin = applyStyles(toJoin, styles, stylesPolicy);
  }

  return toJoin.join(joinWith);
}


export function applyStyles(toJoin, styles, stylesPolicy) {
  let fn = undefined;

  switch(stylesPolicy) {
    case StylesPolicy.IGNORE:
      fn = (acc, key) => key in styles ? acc.push(styles[key]) && acc : acc;
      break;

    case StylesPolicy.WARN:
      fn = (acc, key) => {
        if(key in styles) {
          acc.push(styles[key]);
        } else {
          console.warn(`Key ${key} is missing in styles`);
        }
        return acc;
      };
      break;

    case StylesPolicy.THROW:
      fn = (acc, key) => {
        if(key in styles) {
          acc.push(styles[key]);
        } else {
          throw new Error(`Key ${key} is missing in styles`);
        }
        return acc;
      };
      break;

    default:
      throw new Error(`StylePolicy: "${stylesPolicy}" has invalid value`);
  }

  return toJoin.reduce(fn, []);
}


export function extractModifiers(config) {
  return (extracted, modifiers) => {

    if (Array.isArray(modifiers)) {
      modifiers.forEach((m) => extracted[m] = null);
      return extracted;
    }

    if (typeof modifiers == 'object') {
      const sep = config.separators.keyValue;
      const objecExtrac = (key) => {
        if (modifiers[key]) {
          if (config.keyValue) {
            const val =
              isBoolean(modifiers[key]) ? key : key + sep + modifiers[key];
            extracted[val] = null;
          } else {
            extracted[key] = null;
          }
        }
      };

      Object.keys(modifiers).forEach(objecExtrac);
      return extracted;
    }

    if (!isString(modifiers)) {
      throw new TypeError(
        `Provided modifiers: "${modifiers}" is not supported`
      );
    }

    switch(config.stringModifiers) {
      case StringModifiers.ALLOW:
        extracted[modifiers] = null;
        break;

      case StringModifiers.THROW:
        throw new TypeError(`Provided modifier "${modifiers}" is now allowed!`);

      case StringModifiers.WARN:
        console.warn(`Provided modifier "${modifiers}" is now allowed!`);
        break;

      case StringModifiers.PASS_THROUGH:
        break;
    }

    return extracted;
  };
}


function isString(str) {
  return typeof str == 'string' || str instanceof String;
}


function isBoolean(val) {
  return typeof val == 'boolean' || val instanceof Boolean;
}


export function defaultParseModifier(config, bemName, modifier) {
  if (modifier in config.states) {
    return config.states[modifier];
  }

  return bemName + config.separators.modifier + modifier;
}
