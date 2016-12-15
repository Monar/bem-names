# bem-name

Simple function for generating bem-like classNames inspired by classNames, bem-classname, bem-classnames

### It's under heavy development so be warned

Expect many changes, and some more stable release around end of December 2016.

### How it works (general idea - might change in the future)

```
import bemNames from 'bem-names';

bemNames('block', 'element', ['mod1], { mod2: true, mod3: false })
// will return block__element block__element--mod1 block__element--mod2

import { customBemNames } from 'bem-names';

const separators = { modifier: '#', element: '-' };
const states = { mod1: 'is-mod1' };
const config = { separators, states };

customBemNames(consfig, 'block', 'element', ['mod1], { mod2: true, mod3: false })
// will return block-element is-mod1 block-element#mod2

import { bemNamesFactory } from 'bem-names';

const separators = { modifier: '#', element: '-' };
const states = { mod1: 'is-mod1' };
const config = { separators, states };

const bem = bemNamesFactory('block', states, separators);

bem('element')
// will return block-element is-mod1 block-element#mod2

bem('element', { mod1: true })
// will return block-element is-mod1
