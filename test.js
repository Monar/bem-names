/* eslint-env mocha */

import { assert } from 'chai';
import {
  extractModifier,
  bemNameFactory,
  customBemName,
  parseModifier,
  applyMods,
  bemName,
} from './bem-name';


describe('extractModifier', function() {

  it('should throw TypeError', () => {
    const fn = () => extractModifier('string param');
    assert.throws(fn, TypeError);
  });

  it('should return same array', () => {
    const sample = ['blue', 'big'];
    const result = extractModifier(sample);
    assert.equal(result, sample);
  });

  it('should return array of elements with positive value', () => {
    const sample = { blue: false, big: 'that should be true' };
    const result = extractModifier(sample);
    assert.deepEqual(result, ['big']);
  });

});

describe('parseModifier', function() {

  it('should create proper bem modifier', () => {
    const bemName = 'block__element';
    const modifier = 'super';
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };
    const parsedModifier = parseModifier(config, bemName, modifier);

    assert.equal(parsedModifier, 'block__element--super');
  });

  it('should return string based on states map', () => {
    const bemName = 'block__element';
    const modifier = 'ok';
    const config = {
      states: { ok: 'is-ok' },
      separators: { element: '__', modifier: '--' },
    };
    const parsedModifier = parseModifier(config, bemName, modifier);

    assert.equal(parsedModifier, 'is-ok');
  });

});

describe('applyMods', function() {

  it('should generate proper className (no states)', () => {
    const bemName = 'block';
    const modifiers = [ ['super'], { ok: true, disabled: false } ];
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };
    const className = applyMods(config, bemName, modifiers);

    assert.equal(className, 'block block--super block--ok');
  });

  it('should return proper className (with state) ', () => {
    const bemName = 'block';
    const modifiers = [
      ['super'],
      { ok: true, disabled: false, negative: false },
      [ 'done'],
    ];
    const config = {
      states: { ok: 'is-ok', done: 'is-done', negative: 'is-negative' },
      separators: { element: '__', modifier: '--' },
    };
    const className = applyMods(config, bemName, modifiers);

    assert.equal(className, 'block block--super is-ok is-done');
  });

});

describe('customBemName', function() {

  it('should work with just a block', () => {
    const block = 'block';
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };

    const expected = applyMods(config, block, []);
    const result = customBemName(config, block);

    assert.equal(result, expected);
  });

  it('should work with just a block and element', () => {
    const block = 'block';
    const element = 'element';
    const bemName = 'block__element';
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };

    const expected = applyMods(config, bemName, []);
    const result = customBemName(config, block, element);

    assert.equal(result, expected);
  });

  it('should work with block', () => {
    const block = 'block';
    const modifiers = [ ['super'], { ok: true, disabled: false } ];
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };

    const expected = applyMods(config, block, modifiers);
    const result = customBemName(config, block, ...modifiers);

    assert.equal(result, expected);
  });

  it('should work with block and element', () => {
    const block = 'block';
    const element = 'element';
    const bemName = 'block__element';
    const modifiers = [ ['super'], { ok: true, disabled: false } ];
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };

    const expected = applyMods(config, bemName, modifiers);

    const result = customBemName(config, block, element, ...modifiers);

    assert.equal(result, expected);
  });

});

describe('bemName', function() {

  it('should just work', () => {
    const result = bemName('block');
    assert.equal(result, 'block');
  });

  it('should just work with element', () => {
    const result = bemName('block', 'element');
    assert.equal(result, 'block__element');
  });

  it('should just work with element and modifiers', () => {
    const result = bemName(
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

});

describe('bemNameFactory', function() {

  it('should return function', () => {
    const result = bemNameFactory();
    assert.isFunction(result);
  });

  it('should work like bemName with no block provided', () => {
    const factory = bemNameFactory();

    assert.equal(factory('elo'), bemName('elo'));
    assert.equal(factory('elo', 'elo'), bemName('elo', 'elo'));
    assert.equal(
      factory('elo', 'elo', ['www']),
      bemName('elo', 'elo', ['www'])
    );
  });

  it('should work like (...args) => bemName(block, ...args)', () => {
    const factory = bemNameFactory('block');

    assert.equal(factory(), bemName('block'));
    assert.equal(factory('elo'), bemName('block', 'elo'));
    assert.equal(
      factory('elo', ['www']),
      bemName('block', 'elo', ['www'])
    );
  });

  it('should work with custom separators', () => {
    const factory = bemNameFactory(
      'block',
      {},
      { element: '::', modifier: '|' }
    );

    assert.equal(factory('elo', ['www']), 'block::elo block::elo|www');
  });

  it('should work with states custom labels, and custom separators', () => {
    const factory = bemNameFactory(
      'block',
      { ok: 'is-ok' },
      { element: '::', modifier: '@' }
    );

    assert.equal(
      factory('elo', ['www', 'ok']),
      'block::elo block::elo@www is-ok');
  });

  it('should work with states custom labels', () => {
    const factory = bemNameFactory(
      'block',
      { ok: 'is-ok' }
    );

    assert.equal(
      factory('elo', ['www', 'ok']),
      'block__elo block__elo--www is-ok');
  });

});
