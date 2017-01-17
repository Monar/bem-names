# bemNames

[![Build Status](https://travis-ci.org/Monar/bem-names.svg?branch=master)](https://travis-ci.org/Monar/bem-names)
[![npm version](https://badge.fury.io/js/bem-names.svg)](https://badge.fury.io/js/bem-names)

Advance generator of bem-like class names. `bemNames` can follow any BEM naming
convention and allow easy transition between any of them. It supports
transition in and out from classic
[classnames][classnames] as well as
[css-Modules](https://github.com/css-modules/css-modules).

## Install

```bash
yarn add bem-names
npm install bem-names --save
```

## Basic usage

The `bemNames` function takes any number of arguments which can be a string,
array or object. First two arguments must be strings and they are threated as
block and element names. Default configuration blocks usage of modifiers not
wrapped with `[]` or `{}` to maintain clarity of what is a block or an element
and what is a modifier. This and many other behaviours can be changed, check
[advance usage](#advance-usage).

```js
import bemNames from 'bem-names';

bemNames('block'); // block
bemNames('block', ['mod']); // block block--mod
bemNames('block', 'element', ['mod']); // block__element block__element--mod
bemNames('block', 'element', { mod2: true, mod3: false }); // 'block__element block__element--mod2'
```

With factory:

```js
import { bemNamesFactory } from 'bem-names';

const bem = bemNamesFactory('block');

bem(); // block
bem(['mod']); // block block--mod
bem('element', ['mod']); // block__element block__element--mod
bem('element', { mod2: true, mod3: false }); // 'block__element block__element--mod2'
```

Check [advance usage](#advance-usage)

## Motivation

When I tried to add component from [npm](https://www.npmjs.com/) to project
following one of BEM-naming conventions I've encounter two obstacles:

* There was a class name collision with existing components
* The component followed different class naming convention, and did not fit
  with existing [scss](http://sass-lang.com/) helper functions.


Ideal solution would be if the component had an option to pass a class name
generator (same way I'm  working in the mentioned project). Unfortunately this
was not the case, so I've decided to change it. First step write such flexible
generator, with option to apply
[css-modules](https://github.com/css-modules/css-modules) in the near future.


Done :D

### Other projects

There are many great generators of BEM-like class names. But neither of them
can be applied as such generic generator covering various conventions. Below
are few  project I've tested.

* **[bem-classname](https://www.npmjs.com/package/bem-classname)** Very basic
generator covering single convention.

* **[bem-classnames](https://www.npmjs.com/package/bem-classnames)** Basic
generator covering single convention with troublesome need of setting up
configuration for every component. The slowest of presented here.

* **[b_](https://www.npmjs.com/package/b_)** Very fast generator allowing basic
configuration but limited to two BEM variations.

* **[bem-cn](https://www.npmjs.com/package/bem-cn)** Versatile BEM class name
generator. Does not have flexible API allowing to apply other conventions.
Personally prefer API similar to "classic" [classnames][classnames].

* **[classnames](https://www.npmjs.com/package/bem-cn)** Good class name
generator but with no support for BEM. :]

### Performance
I've performed some performance tests. Each packaged received same parameters,
and bemNames was configured to match output for each of the packages.

*Implementation with De-duplication was about 18% slower.*


| |10K | bemNames |
|:-:|--:|:-:|
|b_              | 2ms   | 12ms |
|bem-classname   | 13ms  | 11ms  |
|bem-classanmes  | 72ms  | 11ms  |
|bem-cn          | 23ms  | 12ms  |
|classnames      | 3ms   | 7ms  |


## Advance usage

`bemNames` was create with castomization in mind. Configuration object is
merged with the default configuration so there is no need to specify all of the
options every time.

```js
import { customBemNames } from 'bem-names';

const config = {
  separators: { element: '-' },
  states = { mod1: 'is-mod1' },
};

customBemNames(config, 'block', 'element', ['mod1']); // 'block-element is-mod1'
```

The `customBemNames` is created for in-line usage, for more generic approuch there is `bemNamesFactory`.

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  separators: { element: '-' },
  states = { mod1: 'is-mod1' },
};

const bem = bemNamesFactory('block', config);

bem('element', ['mod1']); // 'block-element is-mod1'
```

### Config object

```js
const defaultConfig = {

  /**
  * Treat first string as block and a second one as modifier.
  * eg. cbn({ bemLike: false}, block, element, ['mod']) // funny and makes no sense
  */
  bemLike: true,

  separators: { element: '__', modifier: '--', keyValue: '-' },

  states: {},

  joinWith: ' ',

  keyValue: false,

  stringModifiers: StringModifiers.WARN,

  parseModifier: defaultParseModifier, // (config:object, bemName:str, modifier:str) => string

  styles: undefined,

  stylesPolicy: StylesPolicy.WARN,
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

bem('element');
// 'block__element block__element'

bem('element', { mod1: true });
// 'block__element block__element--mod1'
```

##### Advance usage

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  separators = { element: '-' },
  states = { mod1: 'is-mod1' },
};

const bem = bemNamesFactory('block', config);

bem('element');
// 'block-element'

bem('element', { mod1: true });
// 'block-element is-mod1'
```

#### Configuration samples

##### emulate classNames like behaviour

```js
import { bemNamesFactory, StringModifiers } from 'bem-names';

const config = {
  stringModifiers: StringModifiers.ALLOW,
  bemLike: false,
  parseModifier: (c, n, m) => m,
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', 'element', { mod1: true, mod2: false }, ['mod3'], 'mod4');
// 'block element mod1 mod3 mod4'

```

##### bem with regular classes

```js
import { bemNamesFactory, StringModifiers } from 'bem-names';

const config = {
  stringModifiers: StringModifiers.PASS_THROUGH,
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', 'element', { mod1: true, mod2: false }, 'mod3');
// 'block__element block__element--mod1 mod3'

```

##### bem with states

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  states = { disabled: 'is-disable', values: 'has-values' },
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', { disabled: true, mod: true });
// 'block is-disabled block--mod'

```

##### bem with keyValues

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  keyValue = true,
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', { disabled: true, mod: false, key: 'value' });
// 'block block--disabled block--key-value'

```

#####  css-modules

```js
import { bemNamesFactory, StylesPolicy } from 'bem-names';

const config = {
  styles: { block: '123', 'block--disabled': 234 },
};

const cn = (...args) => customBemNames(config, ...args);

cn('block', { disabled: true, mod: false });
// '123 234'

cn('block', { disabled: true, key: 'value' });
// console: 'Key "key" is missing in styles'
// '123 234'

```

[classnames]: https://www.npmjs.com/package/classnames
