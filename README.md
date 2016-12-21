# bemNames

Simple function for generating bem-like classNames inspired by classNames, bem-classname, bem-classnames.

I'm creating this package to allow use of shared components within projects using other variations of BEM naming convention.

### It's under heavy development so be warned

Expect many changes, and some more stable release around end of December 2016!

### How it works (general idea - might change in the future)

##### Basic in-line usage (preferred BEM naming convection)
```js
import bemNames from 'bem-names';

bemNames('block', 'element', ['mod1'], { mod2: true, mod3: false })
// will return block__element block__element--mod1 block__element--mod2
```

##### In-line usage (apply custom config)
```js
import { customBemNames } from 'bem-names';

const separators = { modifier: '#', element: '-' };
const states = { mod1: 'is-mod1' };
const config = { separators, states };

customBemNames(config, 'block', 'element', ['mod1'], { mod2: true, mod3: false })
// will return block-element is-mod1 block-element#mod2
```

##### Config object (current state)
```js
const defaultConfig = {
  separators: { element: '__', modifier: '--' },
  states: {},
  parseModifier: defaultParseModifier, // (config:object, bemName:str, modifier:str) => string
};
```

##### General approach to bemNames

```js
import { bemNamesFactory } from 'bem-names';

const separators = { modifier: '#', element: '-' };
const states = { mod1: 'is-mod1' };
const config = { separators, states };

const bem = bemNamesFactory('block');

bem('element')
// will return block__element block__element

bem('element', { mod1: true })
// will return block__element block__element--mod1
```

###### with custom config

```js
import { bemNamesFactory } from 'bem-names';

const separators = { modifier: '#', element: '-' };
const states = { mod1: 'is-mod1' };
const config = { separators, states };

const bem = bemNamesFactory('block', config);

bem('element')
// will return block-element

bem('element', { mod1: true })
// will return block-element is-mod1
```
