export const defaultConfig = {
  separators: { element: '__', modifier: '--' },
  states: {},
  joinWith: ' ',
  parseModifier: defaultParseModifier,
};


export function bemNames(...args) {
  return customBemNames(defaultConfig, ...args);
}


export function bemNamesFactory(block, customConfig={}){
  const config = Object.assign({}, defaultConfig, customConfig);
  if (!isString(block)) {
    throw TypeError(`block name: "${block}" is not a string`);
  }

  return (...args) => customBemNames(config, block, ...args);
}


export  function customBemNames(config, block, ...args) {
  let bemName = block;
  if (isString(args[0])) {
    bemName = block + config.separators.element + args[0];
    return applyMods(config, bemName, args.slice(1));
  }

  return applyMods(config, bemName, args);
}


export function applyMods(config, bemName, modifiers) {
  const { parseModifier, joinWith } = config;
  const extracted = modifiers.reduce(extractModifier, []);
  const parsed = extracted.map((mod) => parseModifier(config, bemName, mod));

  return [bemName].concat(parsed).join(joinWith);
}


export function extractModifier(extracted, modifiers) {
  if (Array.isArray(modifiers)) {
    return extracted.concat(modifiers);
  }

  if (typeof modifiers === 'object') {
    const extractedModifiers = Object.keys(modifiers)
      .map((key) => modifiers[key] ? key : null)
      .filter((val) => val !== null);
    return extracted.concat(extractedModifiers);
  }

  throw new TypeError(
    `Provided modifiers:${modifiers} are neither an Array nor an Object`
  );
}


function isString(str) {
  return typeof str === 'string' || str instanceof String;
}


export function defaultParseModifier(config, bemName, modifier) {
  if (modifier in config.states) {
    return config.states[modifier];
  }

  return bemName + config.separators.modifier + modifier;
}
