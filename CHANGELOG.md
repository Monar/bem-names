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
