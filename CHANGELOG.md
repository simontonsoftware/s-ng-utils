# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.1](https://github.com/simontonsoftware/s-ng-utils/compare/v0.4.0...v0.4.1) (2019-06-26)

### Bug Fixes

- remove accidental dependency on `s-ng-dev-utils` ([6da82c3](https://github.com/simontonsoftware/s-ng-utils/commit/6da82c3))

## [0.4.0](https://github.com/simontonsoftware/s-ng-utils/compare/v0.3.1...v0.4.0) (2019-05-30)

### Features

- Upgrade dependencies ([b0de2a1](https://github.com/simontonsoftware/s-ng-utils/commit/b0de2a1))

### BREAKING CHANGES

- Uses Typescript 3.4 (up from 3.1)
- Requires Rxjs 6.4 (up from 6.3)
- Requires Angular 8 (up from 7)
- Requires micro-dash 6 (up from 5)
- Requires s-rxjs-utils 2 (up from 1)

<a name="0.3.1"></a>

## [0.3.1](https://github.com/simontonsoftware/s-ng-utils/compare/v0.3.0...v0.3.1) (2019-01-09)

### Bug Fixes

- allow `DirectiveSuperclass.getInput$()` to be used in templates ([8e67212](https://github.com/simontonsoftware/s-ng-utils/commit/8e67212))
- expose `DirectiveSuperclass` in the public api ([b00f390](https://github.com/simontonsoftware/s-ng-utils/commit/b00f390))

<a name="0.3.0"></a>

# [0.3.0](https://github.com/simontonsoftware/s-ng-utils/compare/v0.2.0...v0.3.0) (2018-12-15)

### Features

- `FormControlSuperclass` now extends `DirectiveSuperclass` ([f23a535](https://github.com/simontonsoftware/s-ng-utils/commit/f23a535))
- add `DirectiveSuperclass` ([b2d0213](https://github.com/simontonsoftware/s-ng-utils/commit/b2d0213))

<a name="0.2.0"></a>

# [0.2.0](https://github.com/simontonsoftware/s-ng-utils/compare/v0.1.0...v0.2.0) (2018-11-12)

### Bug Fixes

- **WrappedFormControlSuperclass:** it is no longer necessary to call `onTouched()` ([53f9c24](https://github.com/simontonsoftware/s-ng-utils/commit/53f9c24))

### Chores

- upgrade dependencies ([27aad30](https://github.com/simontonsoftware/s-ng-utils/commit/27aad30))

### BREAKING CHANGES

- uses Typescript 3 (up from Typescript 2)
- requires Angular 7 (up from Angular 6)
- requires s-rxjs-utils 1 (up from s-rxjs-utils 0.2)

<a name="0.1.0"></a>

# 0.1.0 (2018-09-04)

### Features

- add `AutoDestroyable` ([16cb7d8](https://github.com/simontonsoftware/s-ng-utils/commit/16cb7d8))
- add `FormControlSuperclass` and `provideValueAccessor()` ([57314f2](https://github.com/simontonsoftware/s-ng-utils/commit/57314f2))
- add `WrappedFormControlSuperclass` ([de118dd](https://github.com/simontonsoftware/s-ng-utils/commit/de118dd))
