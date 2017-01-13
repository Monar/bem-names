/* eslint-env mocha */

import { assert } from 'chai';
import {
  defaultConfig,
  StringModifiers,
  StylesPolicy,
  defaultParseModifier,
  extractModifiers,
  bemNamesFactory,
  customBemNames,
  applyMods,
  applyStyles,
  bemNames,
} from './bem-names';


describe('extractModifier', function() {

  it('should returned function', () => {
    const fn = extractModifiers(defaultConfig);
    assert.isFunction(fn);
  });

  it('should throw for incorrect type', () => {
    const extract = extractModifiers(defaultConfig);
    const fn = () => extract({}, null);
    assert.throws(fn, TypeError);
  });

  it('should throw for string', () => {
    const config = {
      ...defaultConfig,
      stringModifiers: StringModifiers.THROW,
    };

    const extract = extractModifiers(config);

    const fn = () => extract({}, 'string');
    assert.throws(fn, TypeError);
  });

  it('should not throw for string, but print to console', () => {
    const config = {
      ...defaultConfig,
      stringModifiers: StringModifiers.WARN,
    };

    const extract = extractModifiers(config);

    let result = false;
    const fn = () => { result = extract({}, 'string'); };
    assert.doesNotThrow(fn, TypeError, 'don\'t throw');
    assert.deepEqual(result, {}, 'does not add string to result');
  });

  it('should not add a string', () => {
    const config = {
      ...defaultConfig,
      stringModifiers: StringModifiers.ALLOW,
    };

    const extract = extractModifiers(config);
    const result =  extract({}, 'string');

    assert.deepEqual(result, { string: null });
  });

  it('should omit a string', () => {
    const config = {
      ...defaultConfig,
      stringModifiers: StringModifiers.PASS_THROUGH,
    };

    const extract = extractModifiers(config);
    const result =  extract({}, 'string');

    assert.deepEqual(result, {});
  });

  it('should return same values', () => {
    const extract = extractModifiers(defaultConfig);
    const sample = ['blue', 'big'];

    const result = extract({}, sample);
    assert.deepEqual(result, { blue: null, big: null });
  });

  it('should return set of elements with positive value', () => {
    const extract = extractModifiers(defaultConfig);
    const sample = { blue: false, big: 'that should be true' };
    const result = extract({}, sample);
    assert.deepEqual(result, { big: null });
  });

  it('should return set without duplicates', () => {
    const extract = extractModifiers(defaultConfig);
    const init = { big: null };
    const sample = { big: true };
    const result = extract(init, sample);
    assert.deepEqual(result, init);
  });

  it('should extract kevValue strings', () => {
    const config = {
      ...defaultConfig,
      keyValue: true,
    };
    const extract = extractModifiers(config);
    const sample = { big: 'value' };
    const result = extract({}, sample);
    assert.deepEqual(result, { 'big-value': null });
  });

  it('should extract kevValue with custom separator', () => {
    const config = {
      ...defaultConfig,
      keyValue: true,
      separators: { keyValue: '@' },
    };
    const extract = extractModifiers(config);
    const sample = { big: 'value' };
    const result = extract({}, sample);
    assert.deepEqual(result, { 'big@value': null });
  });

  it('should extract kevValue with just key, when value is boolean', () => {
    const extract = extractModifiers(defaultConfig);
    const sample = { big: true };
    const result = extract({}, sample);
    assert.deepEqual(result, { big: null });
  });

});

describe('defaultParseModifier', function() {

  it('should create proper bem modifier', () => {
    const bemNames = 'block__element';
    const modifier = 'super';
    const parsedModifier =
      defaultParseModifier(defaultConfig, bemNames, modifier);
    assert.equal(parsedModifier, 'block__element--super');
  });

  it('should return string based on states map', () => {
    const bemNames = 'block__element';
    const modifier = 'ok';
    const config = {
      ...defaultConfig,
      states: { ok: 'is-ok' },
      separators: { element: '__', modifier: '--' },
    };
    const parsedModifier = defaultParseModifier(config, bemNames, modifier);

    assert.equal(parsedModifier, 'is-ok');
  });

});

describe('applyStyles', function() {

  it('should throw for unknown stylesPolicy', () => {
    const toJoin = ['block', 'block--super'];
    const styles = { block: 'xxx' };
    const stylesPolicy = 'laskdjfasdlkfjasdf';

    const fn = () => applyStyles(toJoin, styles, stylesPolicy);

    assert.throws(fn, Error);
  });

  it('should ignore missing styles', () => {
    const toJoin = ['block', 'block--super'];
    const styles = { block: 'xxx' };
    const stylesPolicy = StylesPolicy.IGNORE;

    const result = applyStyles(toJoin, styles, stylesPolicy);

    assert.deepEqual(result, ['xxx']);
  });

  it('should ignore and print warning for missing styles', () => {
    const toJoin = ['block', 'block--super'];
    const styles = { block: 'xxx' };
    const stylesPolicy = StringModifiers.WARN;

    const result = applyStyles(toJoin, styles, stylesPolicy);

    assert.deepEqual(result, ['xxx']);
  });

  it('should throw for missing styles', () => {
    const toJoin = ['block', 'block--super'];
    const styles = { block: 'xxx' };
    const stylesPolicy = StringModifiers.THROW;

    const fn = () => applyStyles(toJoin, styles, stylesPolicy);

    assert.throws(fn, Error);
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
    const config = {
      ...defaultConfig,
      states: { ok: 'is-ok', done: 'is-done', negative: 'is-negative' },
    };
    const classNames = applyMods(config, bemNames, modifiers);

    assert.equal(classNames, 'block block--super is-ok is-done');
  });

  it('should handle stringModifiers', () => {
    const bemNames = 'block';
    const modifiers = ['super', 'double', ['done']];
    const config = {
      ...defaultConfig,
      states: { done: 'is-done' },
      stringModifiers: StringModifiers.ALLOW,
    };
    const classNames = applyMods(config, bemNames, modifiers);

    assert.equal(classNames, 'block block--super block--double is-done');
  });

  it('should handle uniqueModifiers', () => {
    const bemNames = 'block';
    const modifiers = [{ 'super': false }, 'super', ['done'], { done: false } ];
    const config = {
      ...defaultConfig,
      states: { done: 'is-done' },
      stringModifiers: StringModifiers.ALLOW,
    };
    const classNames = applyMods(config, bemNames, modifiers);

    assert.equal(classNames, 'block block--super is-done');
  });

  it('should work with styless', () => {
    const bemNames = 'block';
    const modifiers = [{ 'super': true }];
    const config = {
      ...defaultConfig,
      styles: { block: '123', 'block--super': '234' },
    };
    const classNames = applyMods(config, bemNames, modifiers);

    assert.equal(classNames, '123 234');
  });

  it('should omit all and print warn for empty object styles', () => {
    const bemNames = 'block';
    const modifiers = [{ 'super': true, ok: true }];
    const config = {
      ...defaultConfig,
      styles: {},
    };
    let result = undefined;
    const fn = () => { result = applyMods(config, bemNames, modifiers); };

    assert.doesNotThrow(fn, Error, 'does not throws');
    assert.equal(result, '', 'omits ok');
  });

  it('should throw when missing key in styles', () => {
    const bemNames = 'block';
    const modifiers = [{ 'super': true, ok: true }];
    const config = {
      ...defaultConfig,
      styles: { block: '123', 'block--super': '234' },
      stylesPolicy: StylesPolicy.THROW,
    };
    const fn = () => applyMods(config, bemNames, modifiers);

    assert.throws(fn, Error);
  });

  it('should not throw and omit modifier and print to console', () => {
    const bemNames = 'block';
    const modifiers = [{ 'super': true, ok: true }];
    const config = {
      ...defaultConfig,
      styles: { block: '123', 'block--super': '234' },
      stylesPolicy: StylesPolicy.WARN,
    };

    let result = '';
    const fn = () => { result = applyMods(config, bemNames, modifiers); };

    assert.doesNotThrow(fn, Error, 'does not throws');
    assert.equal(result, '123 234', 'omits ok');
  });

  it('should not throw and omit modifier', () => {
    const bemNames = 'block';
    const modifiers = [{ 'super': true, ok: true }];
    const config = {
      ...defaultConfig,
      styles: { block: '123', 'block--super': '234' },
      stylesPolicy: StylesPolicy.IGNORE,
    };

    let result = '';
    const fn = () => { result = applyMods(config, bemNames, modifiers); };

    assert.doesNotThrow(fn, Error, 'does not throws');
    assert.equal(result, '123 234', 'omits ok');
  });

  it('should omit every modifier for empty styles and ignore policy', () => {
    const bemNames = 'block';
    const modifiers = [{ 'super': true, ok: true }];
    const config = {
      ...defaultConfig,
      styles: {},
      stylesPolicy: StylesPolicy.IGNORE,
    };

    let result = applyMods(config, bemNames, modifiers);
    assert.equal(result, '');
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

    const result = customBemNames(defaultConfig, block, element);

    assert.equal(result, 'block__element');
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

  it('should pass through with string modifiers', () => {
    const block = 'block';
    const element = 'element';
    const modifiers = [ ['super'], 'just_a_string' ];
    const config = {
      ...defaultConfig,
      stringModifiers: StringModifiers.PASS_THROUGH,
    };

    const result = customBemNames(config, block, element, ...modifiers);

    const expected = 'block__element block__element--super just_a_string';
    assert.equal(result, expected);
  });

  it('should work like classnames', () => {
    const block = 'block';
    const element = 'element';
    const modifiers = [ ['super'], { ok: true, disabled: false }, 'string' ];
    const config = {
      stringModifiers: StringModifiers.ALLOW,
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
      stringModifiers: StringModifiers.ALLOW,
    };

    const factory = bemNamesFactory('block', config);

    assert.equal(
      factory(['www', 'ok'], 'test', { wee: true }, 'final'),
      'block www ok test wee final');
  });

  it('should allow basic keyValue modifiers', () => {
    const config = { keyValue: true };

    const factory = bemNamesFactory('block', config);

    assert.equal(
      factory(['www', 'ok'], { wee: true, ups: 'value', ni: false }),
      'block block--www block--ok block--wee block--ups-value');
  });

  it('should apply styles', () => {
    const styles = { 'block--www': '123', block: '321' };
    const config = { styles, stylesPolicy: StylesPolicy.THROW };

    const factory = bemNamesFactory('block', config);

    assert.equal(factory(['www']), '321 123');
  });

});
