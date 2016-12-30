export const StringModifiers = {
  THROW: 'throw',
  WARN: 'warn',
  ALLOW: 'allow',
  PASS_THROUGH: 'passThrough',
};


export const defaultConfig = {
  separators: { element: '__', modifier: '--', keyValue: '-' },
  states: {},
  joinWith: ' ',
  bemLike: true,
  keyValue: false,
  stringModifiers: StringModifiers.THROW,
  parseModifier: defaultParseModifier,
};


export function bemNames(...args) {
  return customBemNames(defaultConfig, ...args);
}


export function bemNamesFactory(block, config={}){
  if (!isString(block)) {
    throw TypeError(`block name: "${block}" is not a string`);
  }

  return (...args) => customBemNames(config, block, ...args);
}


export  function customBemNames(customConfig, block, ...args) {
  const separators =
    Object.assign({}, defaultConfig.separators, customConfig.separators);
  const config = Object.assign({}, defaultConfig, customConfig, { separators });

  if (!config.bemLike) {
    return applyMods(config, '', [block].concat(args));
  }

  if (isString(args[0])) {
    const bemName = block + config.separators.element + args[0];
    return applyMods(config, bemName, args.slice(1));
  }

  return applyMods(config, block, args);
}


export function applyMods(config, bemName, modifiers) {
  const { parseModifier, joinWith, stringModifiers } = config;
  let toExtract = modifiers;
  let toPass = [];

  if (stringModifiers === StringModifiers.PASS_THROUGH) {
    toPass = modifiers.filter((mod) => isString(mod));
  }

  const extracted = toExtract.reduce(extractModifiers(config), new Set());

  const parsed = Array.from(extracted).map(
    (mod) => parseModifier(config, bemName, mod)
  );

  const toJoin = [bemName].concat(parsed, toPass).filter((s) => s !== '');
  return toJoin.join(joinWith);
}


export function extractModifiers(config) {
  return (extracted, modifiers) => {
    if (Array.isArray(modifiers)) {
      modifiers.forEach((m) => extracted.add(m));
      return extracted;
    }

    if (typeof modifiers === 'object') {
      const keys = Object.keys(modifiers)
        .map((key) => modifiers[key] ? key : null)
        .filter((val) => val !== null);

      let addModifier = (m) => extracted.add(m);

      if (config.keyValue) {
        const sep = config.separators.keyValue;
        addModifier = (k) =>
          extracted.add(isBoolean(modifiers[k]) ? k : k + sep + modifiers[k]);
      }

      keys.forEach(addModifier);
      return extracted;
    }

    if (!isString(modifiers)) {
      throw new TypeError(
        `Provided modifiers: "${modifiers}" is not supported`
      );
    }

    switch(config.stringModifiers) {
      case StringModifiers.ALLOW:
        extracted.add(modifiers);
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
  return typeof str === 'string' || str instanceof String;
}


function isBoolean(val) {
  return typeof val === 'boolean' || val instanceof Boolean;
}


export function defaultParseModifier(config, bemName, modifier) {
  if (modifier in config.states) {
    return config.states[modifier];
  }

  return bemName + config.separators.modifier + modifier;
}
