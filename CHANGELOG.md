### 1.3.3

* Fix typo in warning message #2 (@sirctseb)
* Publish smaller package, by excluding tests and source code from bundle.

### 1.3.2

* Add test coverage
* Reduce number of tags

### 1.3.1

* Change formatting of code snippets in README

### 1.3.0

* Update README.md
* Update packages
* Bundle the library as [UMD](https://github.com/umdjs/umd) with [rollup](https://github.com/rollup/rollup)
* Clean and unify packages, those provided by npm are the same as those from cdn
* FIX: remove undocumented `bemNamesEnums` and restore `StringModifiers` and `StylesPolicy`

### 1.2.0

* Add secondary API.
* Bundle the library, and provide links via jsDelivery.

### 1.1.2

* FIX: deprecated `CssModulePolicy` was exported instead of `StylePolicy`.

### 1.1.1

* update license header in files

### 1.1.0

* Drops webpack, now package is properly optimized with other build process.
* Replace `throw Error` with `console.error` and `console.warn`
* handle `NODE_ENV==='production'` and prevent `console.warn`
* fix error when modifier was `null`

### 1.0.0

* Drops de-duplication of modifiers
* Fixes inconsistent order of modifiers
* Improves performance
* Drops `THROW` options from `StringModifiers` and `StylePolicy`
* Fixes `bemLike: false` behaviour
