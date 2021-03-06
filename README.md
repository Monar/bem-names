# bemNames

[![npm version](https://badge.fury.io/js/bem-names.svg)](https://badge.fury.io/js/bem-names)
[![Build Status](https://travis-ci.org/Monar/bem-names.svg?branch=master)](https://travis-ci.org/Monar/bem-names)
[![Test Coverage](https://codeclimate.com/github/Monar/bem-names/badges/coverage.svg)](https://codeclimate.com/github/Monar/bem-names/coverage)

Advanced generator of BEM class names. `bemNames` can follow any BEM
naming convention and allow easy transition between any of them. It also
supports a transition between classic [classnames][classnames] as well as
[css-Modules](https://github.com/css-modules/css-modules).

## Install

```bash
yarn add bem-names
npm install bem-names --save
```
```html
<script src="https://cdn.jsdelivr.net/npm/bem-names/dist/bem-names.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bem-names/dist/bem-names.js"></script>
```

## Basic usage

The `bemNames` function takes any number of arguments, which can be a string,
array or object. The first two arguments must be strings and are treated
accordingly as the name of the block and the element. In the default
configuration, the modifiers must be wrapped with `[]` or `{}`, in order to
maintain clarity of what is a block, element or modifier. This and many other
behaviours can be changed, check [advanced usage](#advanced-usage).

```js
import bemNames from 'bem-names';

bemNames('block');
// 'block'
bemNames('block', ['mod']);
// 'block block--mod'
bemNames('block', 'element', ['mod']);
// 'block__element block__element--mod'
bemNames('block', 'element', { mod2: true, mod3: false });
// 'block__element block__element--mod2'
```

With factory:

```js
import { bemNamesFactory } from 'bem-names';

const bem = bemNamesFactory('block');

bem();
// 'block'
bem(['mod']);
// 'block block--mod'
bem('element', ['mod']);
// 'block__element block__element--mod'
bem('element', { mod2: true, mod3: false });
// 'block__element block__element--mod2'
```

With [secondary API](#secondary-api):

```js
import bemNames from 'bem-names';

const bem =  bemNames.factory(
  'block'
  { stringModifiers: 'passThrough' },
);

bem(['blue'], 'extra-class');
// 'block block--blue extra-class'
```

```js
bemNames.custom({ state: { blue: 'is-blue' } }, 'block', ['blue']);
// 'block is-blue'
```

## Motivation

When I tried to add a BEM-like styled component
[react-select](https://www.npmjs.com/package/react-select) to project with
different BEM-naming conventions I've encounter two obstacles:

* There was a class name collision with existing components
* The component followed different class naming convention, and did not fit
  with existing [scss](http://sass-lang.com/) helper functions.

To work with these kind of components you need to accept their global namespace
presents and/or wrap with dummy element just for styling.

Ideal solution would be if the component had an option to pass a class name
generator ([sample code][bemNames-react-select]), and this is where I've
decided to start. My first step was writing this generator, with option to
transitions to [css-modules](https://github.com/css-modules/css-modules) in the
near future, and this is what this library is all about.


### Other projects

There are many great generators of BEM-like class names. But none of them can
be used as a generic generator covering various conventions. Below are several
projects I've tested.

* **[bem-classname](https://www.npmjs.com/package/bem-classname)** Very basic
generator covering single convention.

* **[bem-classnames](https://www.npmjs.com/package/bem-classnames)** Basic
generator covering single convention with troublesome need of setting up
configuration for every component. The slowest of presented here.

* **[b_](https://www.npmjs.com/package/b_)** Very fast generator allowing basic
configuration but limited in BEM-flexibility.

* **[bem-cn](https://www.npmjs.com/package/bem-cn)** Versatile BEM class name
generator. Does not have flexible API allowing to apply other conventions.
Personally prefer API similar to "classic" [classnames][classnames].

* **[classnames](https://www.npmjs.com/package/bem-cn)** Good class name
generator but without support form BEM-like naming convention. :]

### Performance
I've performed some performance tests. Each packaged received same parameters,
and bemNames was configured to match output for each of the packages.

*Implementation with de-duplication was about 18% slower.*


| |10K | bemNames |
|:-:|--:|:-:|
|b_              | 2ms   | 12ms |
|bem-classname   | 13ms  | 11ms  |
|bem-classanmes  | 101ms | 13ms  |
|bem-cn          | 23ms  | 26ms  |
|classnames      | 3ms   | 7ms  |


## Advanced usage

`bemNames` was create with castomization in mind. Configuration object is
merged with the default configuration so there is no need to specify all of the
options every time.

```js
import { customBemNames } from 'bem-names';

const config = {
  separators: { element: '-' },
  states = { mod1: 'is-mod1' },
};

customBemNames(config, 'block', 'element', ['mod1']);
// 'block-element is-mod1'
```

The `customBemNames` is created for in-line usage, for more generic approuch
there is `bemNamesFactory`.

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  separators: { element: '-' },
  states = { mod1: 'is-mod1' },
};

const bem = bemNamesFactory('block', config);

bem('element', ['mod1']);
// 'block-element is-mod1'
```

### Secondary API

```js
//bemNames.factory = bemNamesFactory;
//bemNames.custom = customBemNames;
//bemNames.StringModifiers = StringModifiers;
//bemNames.StylesPolicy = StylesPolicy;

const config = {
  separators: { element: '-' },
  states = { mod1: 'is-mod1' },
};

bemNames.custom(config, 'block', 'element', ['mod1']);
// 'block-element is-mod1'

const bem = bemNames.factory('block', config);
bem('element', ['mod1']);
// 'block-element is-mod1'
```

### Config object

```js
const defaultConfig = {

  /**
  * When set to false generator will behave
  * like "classic" classnames, also will not use these configuration options::
  * seperators, states, keyValue, stringModifiers, parseModifier.
  */
  bemLike: true,

  separators: { element: '__', modifier: '--', keyValue: '-' },

  /**
  * This configuration option is handled in the default parseModifier. If
  * a modifier will match a key from this object, then instead returning
  * bemName conjuction with modifier, the parser will return appropriate value.
  */
  states: {},

  joinWith: ' ',

  /**
  * When set to true, modifiers from objects will be combined with its
  * values, unless value is type of boolean.
  */
  keyValue: false,

  /**
  * This defines how to handle modifiers not wrap with [] or {}.
  */
  stringModifiers: StringModifiers.WARN,

  /**
  * This function is generating modifier strings. The default implementation is
  * replaces modifiers with values from states and if modifier is not defined
  * in states object then returns bemName joined with the modifier.
  *
  * (config:object, bemName:str, modifier:str) => string
  */
  parseModifier: defaultParseModifier,

  /**
  * This configuration option allows to apply css-modules, just set here object
  * import from styles file.
  */
  styles: undefined,

  /**
  * Determines what to do when given modifer is missing in styles definitions.
  */
  stylesPolicy: StylesPolicy.WARN,
};
```

```js
export const StringModifiers = {

  /**
  * Prints warning and ignores modifiers not wrapped with [] or {}.
  */
  WARN: 'warn',

  /**
  * Allows modifiers not wrapped with [] or {}.
  */
  ALLOW: 'allow',

  /**
  * Modifiers not wrapped with [] or {} are not parsed and are joined at the end of
  * the generated string.
  */
  PASS_THROUGH: 'passThrough',
};
```

```js
export const StylesPolicy = {

  /**
  * Prints warning for missing class name definitios in style objects.
  */
  WARN: 'warn',

  /**
  * Ignores class names not defined in style objects.
  */
  IGNORE: 'ignore',
};
```

### Sample configurations

#### emulate classNames like behaviour

```js
import { customBemNames } from 'bem-names';

const cn = (...args) => customBemNames({ bemLike: false }, ...args);

cn(['block', 'element'], { mod1: false }, ['mod2'], 'mod3');
// 'block element mod2 mod3'
```

#### BEM with regular classes

```js
import { bemNamesFactory, StringModifiers } from 'bem-names';

const config = {
  stringModifiers: StringModifiers.PASS_THROUGH,
};

const bem = bemNamesFactory('block', config);

bem('element', { mod1: true }, 'mod3');
// 'block__element block__element--mod1 mod3'
bem('element', 'mod3');
// 'block__element mod3'
bem('hmmm');
// 'block__hmmm'
```

#### BEM with states

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  states = { disabled: 'is-disable', values: 'has-values' },
};

const bem = bemNamesFactory('block', config);

bem({ disabled: true, mod: true });
// 'block is-disabled block--mod'
```

#### BEM with keyValues

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  keyValue = true,
};

const bem = bemNamesFactory('block', config);

bem({ disabled: true, mod: false, key: 'value' });
// 'block block--disabled block--key-value'
```

####  css-modules

```js
import { bemNamesFactory } from 'bem-names';

const config = {
  styles: { block: '123', 'block--disabled': 234 },
};

const bem = bemNamesFactory('block', config);

cn('block', { disabled: true, mod: false });
// '123 234'

cn('block', { disabled: true, key: 'value' });
// '123 234'
// console: 'Key "key" is missing in styles'
```

[classnames]: https://www.npmjs.com/package/classnames
[bemNames-react-select]: https://github.com/Monar/react-select/commit/0f8983d02b26754a5bf1d45d8ea298500c663ecd
