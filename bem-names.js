import { isString, flatMap } from 'lodash';

const defaultSeparators = { element: '__', modifier: '--' };
export function bemNamesFactory(
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

export function bemNames(...args) {
  const config = { states: {}, separators: defaultSeparators };
  return customBemNames(config, ...args);
}

export  function customBemNames(config, block, ...args) {
  let bemNames = block;

  if (isString(args[0])) {
    bemNames = block + config.separators.element + args[0];
    return applyMods(config, bemNames, args.slice(1));
  }

  return applyMods(config, bemNames, args);
}

export function applyMods(config, bemNames, modifiers) {
  const flattenedModifiers =
    flatMap(modifiers, (mods) => extractModifier(mods));
  const parsedModifiers =
    flattenedModifiers.map((mod) => parseModifier(config, bemNames, mod));
  return [bemNames].concat(parsedModifiers).join(' ');
}

export function parseModifier(config, bemNames, modifier) {
  if (modifier in config.states) {
    return config.states[modifier];
  }

  return bemNames + config.separators.modifier + modifier;
}

export function extractModifier(modifiers) {
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
