# bemNames

[![Build Status](https://travis-ci.org/Monar/bem-names.svg?branch=master)](https://travis-ci.org/Monar/bem-names)
[![npm version](https://badge.fury.io/js/bem-names.svg)](https://badge.fury.io/js/bem-names)

Ultimate generator of bem-like class names. bemNames can follow any BEM naming
convention and allow easy transition between any of them. It supports
transition in and out from classic
[classNames](https://www.npmjs.com/package/classnames) as well as
[css-Modules](https://github.com/css-modules/css-modules).

### Install

```sh
yarn add bem-names
```

```sh
npm install bem-names --save
```

### It's under development so be warned!!!

Expect some changes, and stable release around beginning of January 2017!
As of version `0.4.0` it's mostly feature complete.

### How it works (general idea)

All returned modifiers are unique (no duplicates).

#### Basic in-line usage (default BEM naming convention)
```js
import bemNames from 'bem-names';

bemNames('block', 'element', ['mod1'], { mod2: true, mod3: false })
// 'block__element block__element--mod1 block__element--mod2'
```

#### In-line usage (apply custom config)
```js
import { customBemNames } from 'bem-names';

const separators = { modifier: '#', element: '-' };
const states = { mod1: 'is-mod1' };
const config = { separators, states };

customBemNames(config, 'block', 'element', ['mod1'], { mod2: true, mod3: false })
// 'block-element is-mod1 block-element#mod2'
```

#### Default config object (current state)
```js
const defaultConfig = {
  separators: { element: '__', modifier: '--', keyValue: '-' },
  states: {},
  styles: {},
  stylesPolicy: StylesPolicy.IGNORE,
  joinWith: ' ',
  bemLike: true, // treat first string as block and a second one as modifier.
  keyValue: false,
  stringModifiers: StringModifiers.THROW,
  parseModifier: defaultParseModifier, // (config:object, bemName:str, modifier:str) => string
};
```

#### Enumerators (current state)
```js
export const StringModifiers = {
  THROW: 'throw',
  WARN: 'warn',
  ALLOW: 'allow',
  PASS_THROUGH: 'passThrough', // string values are not parsed and just joint at the end
};
```

```js
export const StylesPolicy = {
  THROW: 'throw',
  WARN: 'warn',
  IGNORE: 'ignore',
};

```

#### Preferred approach

```js
import { bemNamesFactory } from 'bem-names';

const bem = bemNamesFactory('block');

bem('element')
// 'block__element block__element'

bem('element', { mod1: true })
// 'block__element block__element--mod1'
```

##### with custom config

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  separators = { element: '-' };
  states = { mod1: 'is-mod1' };
};

const bem = bemNamesFactory('block', config);

bem('element')
// 'block-element'

bem('element', { mod1: true })
// 'block-element is-mod1'
```

#### Configuration samples

##### emulate classNames like behaviour

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  stringModifiers: StringModifiers.ALLOW,
  bemLike: false,
  parseModifier: (c, n, m) => m,
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', 'element', { mod1: true, mod2; false }, ['mod3'], 'mod4')
// 'block element mod1 mod3 mod4'

```

##### bem with regular classes

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  stringModifiers: StringModifiers.PASS_THROUGH,
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', 'element', { mod1: true, mod2; false }, 'mod3')
// 'block__element block__element--mod1 mod3'

```

##### bem with states

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  states = { disabled: 'is-disable', values: 'has-values' },
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', { disabled: true, mod: true })
// 'block is-disabled block--mod'

```

##### bem with keyValues

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  keyValue = true,
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', { disabled: true, mod: false, key: 'value' })
// 'block block--disabled block--key-value'

```

#####  css-modules

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  styles: { block: '123', 'block--disabled': 234 }
  stylesPolicy: StylesPolicy.WARN,
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', { disabled: true, mod: false })
// '123 234'

cn('block', { disabled: true, key: 'value' })
// console: 'Key "key" is missing in styles'
// '123 234'

```
