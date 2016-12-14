/* eslint-env mocha */

import { assert } from 'chai';
import {
  extractModifier,
  bemNamesFactory,
  customBemNames,
  parseModifier,
  applyMods,
  bemNames,
  flatMap,
} from './bem-names';


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
    const bemNames = 'block__element';
    const modifier = 'super';
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };
    const parsedModifier = parseModifier(config, bemNames, modifier);

    assert.equal(parsedModifier, 'block__element--super');
  });

  it('should return string based on states map', () => {
    const bemNames = 'block__element';
    const modifier = 'ok';
    const config = {
      states: { ok: 'is-ok' },
      separators: { element: '__', modifier: '--' },
    };
    const parsedModifier = parseModifier(config, bemNames, modifier);

    assert.equal(parsedModifier, 'is-ok');
  });

});

describe('applyMods', function() {

  it('should generate proper classNames (no states)', () => {
    const bemNames = 'block';
    const modifiers = [ ['super'], { ok: true, disabled: false } ];
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };
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
    const config = {
      states: { ok: 'is-ok', done: 'is-done', negative: 'is-negative' },
      separators: { element: '__', modifier: '--' },
    };
    const classNames = applyMods(config, bemNames, modifiers);

    assert.equal(classNames, 'block block--super is-ok is-done');
  });

});

describe('customBemNames', function() {

  it('should work with just a block', () => {
    const block = 'block';
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };

    const expected = applyMods(config, block, []);
    const result = customBemNames(config, block);

    assert.equal(result, expected);
  });

  it('should work with just a block and element', () => {
    const block = 'block';
    const element = 'element';
    const bemNames = 'block__element';
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };

    const expected = applyMods(config, bemNames, []);
    const result = customBemNames(config, block, element);

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
    const result = customBemNames(config, block, ...modifiers);

    assert.equal(result, expected);
  });

  it('should work with block and element', () => {
    const block = 'block';
    const element = 'element';
    const bemNames = 'block__element';
    const modifiers = [ ['super'], { ok: true, disabled: false } ];
    const config = {
      states: {},
      separators: { element: '__', modifier: '--' },
    };

    const expected = applyMods(config, bemNames, modifiers);

    const result = customBemNames(config, block, element, ...modifiers);

    assert.equal(result, expected);
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

});

describe('bemNamesFactory', function() {

  it('should return function', () => {
    const result = bemNamesFactory();
    assert.isFunction(result);
  });

  it('should work like bemNames with no block provided', () => {
    const factory = bemNamesFactory();

    assert.equal(factory('elo'), bemNames('elo'));
    assert.equal(factory('elo', 'elo'), bemNames('elo', 'elo'));
    assert.equal(
      factory('elo', 'elo', ['www']),
      bemNames('elo', 'elo', ['www'])
    );
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
    const factory = bemNamesFactory(
      'block',
      {},
      { element: '::', modifier: '|' }
    );

    assert.equal(factory('elo', ['www']), 'block::elo block::elo|www');
  });

  it('should work with states custom labels, and custom separators', () => {
    const factory = bemNamesFactory(
      'block',
      { ok: 'is-ok' },
      { element: '::', modifier: '@' }
    );

    assert.equal(
      factory('elo', ['www', 'ok']),
      'block::elo block::elo@www is-ok');
  });

  it('should work with states custom labels', () => {
    const factory = bemNamesFactory(
      'block',
      { ok: 'is-ok' }
    );

    assert.equal(
      factory('elo', ['www', 'ok']),
      'block__elo block__elo--www is-ok');
  });

});

describe('flatMap', function() {

  it('works with empty []', () => {
    const ind = (v) => v;
    assert.deepEqual(flatMap([], ind), []);
  });

  it('works with empty {}', () => {
    const ind = (v) => v;
    assert.deepEqual(flatMap({}, ind), []);
  });

  it('works with array', () => {
    const ind = (i) => i;
    const array = [1,3,[], [1,2,3]];
    assert.deepEqual(flatMap(array, ind), [1,3,1,2,3]);
  });

  it('works with objects', () => {
    const ind = (i) => i;
    const array = { test: [], noTest: ['elo'] };
    assert.deepEqual(flatMap(array, ind), ['elo']);
  });
});
