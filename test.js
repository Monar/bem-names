/* eslint-env mocha */

import { assert } from 'chai';
import {
  defaultConfig,
  defaultParseModifier,
  extractModifier,
  bemNamesFactory,
  customBemNames,
  applyMods,
  bemNames,
} from './bem-names';


describe('extractModifier', function() {

  it('should throw TypeError', () => {
    const fn = () => extractModifier('string param');
    assert.throws(fn, TypeError);
  });

  it('should return matching set', () => {
    const sample = ['blue', 'big'];
    const result = extractModifier(new Set(), sample);
    assert.deepEqual(result, new Set(sample));
  });

  it('should concatenate  values ', () => {
    const base = new Set(['max']);
    const sample = ['blue', 'big'];
    const result = extractModifier(base, sample);
    assert.deepEqual(result, new Set(['max', 'blud', 'big']));
  });

  it('should return set of elements with positive value', () => {
    const sample = { blue: false, big: 'that should be true' };
    const result = extractModifier(new Set(), sample);
    assert.deepEqual(result, new Set(['big']));
  });

  it('should return set without duplicates', () => {
    const init = new Set(['big']);
    const sample = { big: true };
    const result = extractModifier(init, sample);
    assert.deepEqual(result, init);
  });

});

describe('defaultParseModifier', function() {

  it('should create proper bem modifier', () => {
    const bemNames = 'block__element';
    const modifier = 'super';
    const config = Object.assign({}, defaultConfig, {
      states: {},
      separators: { element: '__', modifier: '--' },
    });
    const parsedModifier = defaultParseModifier(config, bemNames, modifier);
    assert.equal(parsedModifier, 'block__element--super');
  });

  it('should return string based on states map', () => {
    const bemNames = 'block__element';
    const modifier = 'ok';
    const config = Object.assign({}, defaultConfig, {
      states: { ok: 'is-ok' },
      separators: { element: '__', modifier: '--' },
    });
    const parsedModifier = defaultParseModifier(config, bemNames, modifier);

    assert.equal(parsedModifier, 'is-ok');
  });

});

describe('applyMods', function() {

  it('should generate proper classNames (no states)', () => {
    const bemNames = 'block';
    const modifiers = [ ['super'], { ok: true, disabled: false } ];
    const config = defaultConfig;
    const classNames = applyMods(config, bemNames, modifiers);

    assert.equal(classNames, 'block block--super block--ok');
  });

  it('should return proper classNames (with state) ', () => {
    const bemNames = 'block';
    const modifiers = [
      ['super'],
      { ok: true, disabled: false, negative: false },
      [ 'done'],
    ];
    const config = Object.assign({}, defaultConfig, {
      states: { ok: 'is-ok', done: 'is-done', negative: 'is-negative' },
    });
    const classNames = applyMods(config, bemNames, modifiers);

    assert.equal(classNames, 'block block--super is-ok is-done');
  });

  it('should handle stringModifiers', () => {
    const bemNames = 'block';
    const modifiers = ['super', 'double', ['done']];
    const config = Object.assign({}, defaultConfig, {
      states: { done: 'is-done' },
      stringModifiers: true,
    });
    const classNames = applyMods(config, bemNames, modifiers);

    assert.equal(classNames, 'block block--super block--double is-done');
  });

  it('should handle uniqueModifiers', () => {
    const bemNames = 'block';
    const modifiers = [{ 'super': false }, 'super', ['done'], { done: false } ];
    const config = Object.assign({}, defaultConfig, {
      states: { done: 'is-done' },
      stringModifiers: true,
    });
    const classNames = applyMods(config, bemNames, modifiers);

    assert.equal(classNames, 'block block--super is-done');
  });

});

describe('customBemNames', function() {

  it('should work with just a block', () => {
    const block = 'block';
    const config = defaultConfig;

    const expected = applyMods(config, block, []);
    const result = customBemNames(config, block);

    assert.equal(result, expected);
  });

  it('should work with just a block and element', () => {
    const block = 'block';
    const element = 'element';
    const bemNames = 'block__element';
    const config = defaultConfig;

    const expected = applyMods(config, bemNames, []);
    const result = customBemNames(config, block, element);

    assert.equal(result, expected);
  });

  it('should work with block', () => {
    const block = 'block';
    const modifiers = [ ['super'], { ok: true, disabled: false } ];
    const config = defaultConfig;

    const expected = applyMods(config, block, modifiers);
    const result = customBemNames(config, block, ...modifiers);

    assert.equal(result, expected);
  });

  it('should work with block and element', () => {
    const block = 'block';
    const element = 'element';
    const bemNames = 'block__element';
    const modifiers = [ ['super'], { ok: true, disabled: false } ];
    const config = defaultConfig;

    const expected = applyMods(config, bemNames, modifiers);

    const result = customBemNames(config, block, element, ...modifiers);

    assert.equal(result, expected);
  });

  it('should work like classnames', () => {
    const block = 'block';
    const element = 'element';
    const modifiers = [ ['super'], { ok: true, disabled: false }, 'string' ];
    const config = {
      parseModifier: (c, n, m) => m,
      stringModifiers: true,
      bemLike: false,
    };

    const result = customBemNames(config, block, element, ...modifiers);

    assert.equal(result, 'block element super ok string');
  });

});

describe('bemNames', function() {

  it('should just work', () => {
    const result = bemNames('block');
    assert.equal(result, 'block');
  });

  it('should just work with element', () => {
    const result = bemNames('block', 'element');
    assert.equal(result, 'block__element');
  });

  it('should just work with element and modifiers', () => {
    const result = bemNames(
      'block',
      'element',
      ['ok'],
      { go: true, nogo: false }
    );

    assert.equal(
      result,
      'block__element block__element--ok block__element--go'
    );
  });

  it('should return only unique modifiers', () => {
    const result = bemNames(
      'block',
      ['ok'],
      { ok: true, no: false }
    );

    assert.equal( result, 'block block--ok');
  });

});

describe('bemNamesFactory', function() {

  it('should return function', () => {
    const result = bemNamesFactory('');
    assert.isFunction(result);
  });

  it('should throw TypeError when no block provided', () => {
    const fn = () => bemNamesFactory();
    assert.throws(fn, TypeError);
  });

  it('should work like (...args) => bemNames(block, ...args)', () => {
    const factory = bemNamesFactory('block');

    assert.equal(factory(), bemNames('block'));
    assert.equal(factory('elo'), bemNames('block', 'elo'));
    assert.equal(
      factory('elo', ['www']),
      bemNames('block', 'elo', ['www'])
    );
  });

  it('should work with custom separators', () => {
    const config = {
      states: {},
      separators: { element: '::', modifier: '|' },
    };

    const factory = bemNamesFactory('block', config);

    assert.equal(factory('elo', ['www']), 'block::elo block::elo|www');
  });

  it('should work with states custom labels, and custom separators', () => {
    const config = {
      states: { ok: 'is-ok' },
      separators: { element: '::', modifier: '@' },
    };

    const factory = bemNamesFactory('block', config);

    assert.equal(
      factory('elo', ['www', 'ok']),
      'block::elo block::elo@www is-ok');
  });

  it('should work with states custom labels', () => {
    const config = {
      states: { ok: 'is-ok' },
    };

    const factory = bemNamesFactory('block', config);

    assert.equal(
      factory('elo', ['www', 'ok']),
      'block__elo block__elo--www is-ok');
  });

  it('should allow basic classnames simulation', () => {
    const config = {
      states: {},
      parseModifier: (conf, bemName, mod) => mod,
      stringModifiers: true,
    };

    const factory = bemNamesFactory('block', config);

    assert.equal(
      factory(['www', 'ok'], 'test', { wee: true }, 'final'),
      'block www ok test wee final');
  });

});
