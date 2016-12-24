# bemNames

[![Build Status](https://travis-ci.org/Monar/bem-names.svg?branch=master)](https://travis-ci.org/Monar/bem-names)
[![npm version](https://badge.fury.io/js/bem-names.svg)](https://badge.fury.io/js/bem-names)

Simple function for generating bem-like classNames inspired by classNames, bem-classname, bem-classnames.

This package is aiming to provide layer of abstraction between different styles of BEM like naming convention or event classic className behaviour.

### It's under development so be warned!!!

Expect many changes, and some more stable release around beginning of January 2017!

### How it works (general idea - might change in the future)

##### Basic in-line usage (preferred BEM naming convection)
```js
import bemNames from 'bem-names';

bemNames('block', 'element', ['mod1'], { mod2: true, mod3: false })
// will return: 'block__element block__element--mod1 block__element--mod2'
```

##### In-line usage (apply custom config)
```js
import { customBemNames } from 'bem-names';

const separators = { modifier: '#', element: '-' };
const states = { mod1: 'is-mod1' };
const config = { separators, states };

customBemNames(config, 'block', 'element', ['mod1'], { mod2: true, mod3: false })
// will return: 'block-element is-mod1 block-element#mod2'
```

##### Default config object (current state)
```js
const defaultConfig = {
  separators: { element: '__', modifier: '--' },
  states: {},
  joinWith: '',
  bemLike: true,
  allowStringModifiers: false,
  parseModifier: defaultParseModifier, // (config:object, bemName:str, modifier:str) => string
};
```

* [bemLike] flag is treating first string as a block name and a second one as a element
* [allowStringModifiers] flag allows to use strings as modifiers (sth. like classNames) with exception to first and second param (check *bemLike*)

##### General approach to bemNames

```js
import { bemNamesFactory } from 'bem-names';

const separators = { modifier: '#', element: '-' };
const states = { mod1: 'is-mod1' };
const config = { separators, states };

const bem = bemNamesFactory('block');

bem('element')
// will return: 'block__element block__element'

bem('element', { mod1: true })
// will return: 'block__element block__element--mod1'
```

##### with custom config

```js
import { bemNamesFactory } from 'bem-names';

const separators = { modifier: '#', element: '-' };
const states = { mod1: 'is-mod1' };
const config = { separators, states };

const bem = bemNamesFactory('block', config);

bem('element')
// will return: 'block-element'

bem('element', { mod1: true })
// will return: 'block-element is-mod1'
```

##### emulate classNames like behaviour 

```js
import { bemNamesFactory } from 'bem-names';

const config = { 
  allowStringModifiers: true,
  bemLike: false,
  parseModifier: (c, n, m) => m,
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', 'element', { mod1: true, mod2; false }, ['mod3'], 'mod4')
// will return: 'block element mod1 mod3 mod4'

```
