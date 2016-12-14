import { isString, flatMap } from 'lodash';

const defaultSeparators = { element: '__', modifier: '--' };
export function bemNameFactory(
  block,
  states = {},
  separators = defaultSeparators
){
  const config = { block, states, separators };
  if (block === undefined) {
    return (...args) => customBemName(config, ...args);
  }

  return (...args) => customBemName(config, block, ...args);
}

export function bemName(...args) {
  const config = { states: {}, separators: defaultSeparators };
  return customBemName(config, ...args);
}

export  function customBemName(config, block, ...args) {
  let bemName = block;

  if (isString(args[0])) {
    bemName = block + config.separators.element + args[0];
    return applyMods(config, bemName, args.slice(1));
  }

  return applyMods(config, bemName, args);
}

export function applyMods(config, bemName, modifiers) {
  const flattenedModifiers =
    flatMap(modifiers, (mods) => extractModifier(mods));
  const parsedModifiers =
    flattenedModifiers.map((mod) => parseModifier(config, bemName, mod));
  return [bemName].concat(parsedModifiers).join(' ');
}

export function parseModifier(config, bemName, modifier) {
  if (modifier in config.states) {
    return config.states[modifier];
  }

  return bemName + config.separators.modifier + modifier;
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
