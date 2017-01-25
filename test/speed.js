/* eslint-disable max-len */
const b = require('b_');
const bemCN  = require('bem-cn');
const classNames  = require('classnames');
const bemClassname  = require('bem-classname');
const bemClassnames  = require('bem-classnames');
const dist = require('../lib');

const runCount = 10 * 1000;

function testRunner(times, name, fn) {
  const time = Date.now();
  for (let i = 0; i < runCount; i++) {
    fn();
  }
  const totalTime = Date.now() - time;
  return `${totalTime}ms\t${name}`;
}

const results = [];

const fn1 = () => bemClassname('block', 'elem', { mod1: true, mod2: false, mod3: 'mod3' });
const fn2 = () => dist.bemNames('block', 'elem', { mod1: true, mod2: false, mod3: 'mod3' });

results.push(testRunner(runCount, 'bem-classname', fn1));
results.push(testRunner(runCount, 'bem-classname', fn1));
results.push(testRunner(runCount, 'bem-classname', fn1));
results.push(testRunner(runCount, 'bemNames', fn2));
results.push(testRunner(runCount, 'bemNames', fn2));
results.push(testRunner(runCount, 'bemNames', fn2));
results.push('-------------------------');


const config4 = { keyValue: true, stringModifiers: 'allow', separators: { modifier: '_', keyValue: '_' } };
const bem4 = dist.bemNamesFactory('block', config4);

const fn3 = () => b('block', 'elem', { mod1: true, mod2: false, mod3: 'mod3' });
const fn4 = () => bem4('elem', { mod1: true, mod2: false, mod3: 'mod3' });

results.push(testRunner(runCount, 'b_', fn3));
results.push(testRunner(runCount, 'b_', fn3));
results.push(testRunner(runCount, 'b_', fn3));
results.push(testRunner(runCount, 'bemNames', fn4));
results.push(testRunner(runCount, 'bemNames', fn4));
results.push(testRunner(runCount, 'bemNames', fn4));
results.push('-------------------------');

const config6 = { keyValue: true, separators: { modifier: '_', keyValue: '_' } };
const bem6 = dist.bemNamesFactory('block', config6);

const block = bemCN('block');

const fn5 = () => block('elem', { mod1: true, mod2: false, mod3: 'mod3' }).toString();
const fn6 = () => bem6('elem', { mod1: true, mod2: false, mod3: 'mod3' });

results.push(testRunner(runCount, 'bem-cn', fn5));
results.push(testRunner(runCount, 'bem-cn', fn5));
results.push(testRunner(runCount, 'bem-cn', fn5));
results.push(testRunner(runCount, 'bemNames', fn6));
results.push(testRunner(runCount, 'bemNames', fn6));
results.push(testRunner(runCount, 'bemNames', fn6));
results.push('-------------------------');

const classes = {
  name: 'block',
  modifiers: ['mod1', 'mod2', 'mod3'],
  states: ['what'],
};

const config8 = {
  states: { what: 'is-what' },
  stringModifiers: 'passThrough',
};

const bem8 = dist.bemNamesFactory('block', config8);

const fn7 = () => bemClassnames( classes, { mod1: true, mod2: false, mod3: 'mod3' });
const fn8 = () => bem8({ mod1: true, mod2: false, mod3: 'mod3' });

results.push(testRunner(runCount, 'bem-classnames', fn7));
results.push(testRunner(runCount, 'bem-classnames', fn7));
results.push(testRunner(runCount, 'bem-classnames', fn7));
results.push(testRunner(runCount, 'bemNames', fn8));
results.push(testRunner(runCount, 'bemNames', fn8));
results.push(testRunner(runCount, 'bemNames', fn8));
results.push('-------------------------');

const config10 = {
  bemLike: false,
  parseModifier: (c, n, m) => m,
  stringModifiers: 'allow',
};

const bem10 = dist.bemNamesFactory('block', config10);

const fn9 = () => classNames('block', 'elem', { mod1: true, mod2: false, mod3: 'mod3' });
const fn10 = () => bem10('elem', { mod1: true, mod2: false, mod3: 'mod3' });

results.push(testRunner(runCount, 'classnames', fn9));
results.push(testRunner(runCount, 'classnames', fn9));
results.push(testRunner(runCount, 'classnames', fn9));
results.push(testRunner(runCount, 'bemNames', fn10));
results.push(testRunner(runCount, 'bemNames', fn10));
results.push(testRunner(runCount, 'bemNames', fn10));
results.push('-------------------------');

results.forEach((i) => console.warn(i));
