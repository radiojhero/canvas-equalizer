# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!--

## [X.X.X] - 20XX-XX-XX

Nothing relevant yet.

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

-->

## [Unreleased]

### Changed

-   Switched Webpack for Rollup;
-   Updated convolver behavior to match spec.

## 0.2.0 - 2017-03-12

This is a fork of Carlos Rafael Gimenes das Neves's [GraphicalFilterEditor].

### Added

-   Responsive UI (including DPI awareness);
-   Built using Webpack;
-   Code linting;
-   Localization and internationalization;
-   RTL support;
-   Can be installed via NPM or Yarn.

### Changed

-   Analyser files have been moved to the demo;
-   The demo is on its own branch;
-   Everything but the demo has been ported to TypeScript;
-   Styles ported to SASS;
-   Refactored mouse and touch event handling to use Pointer Events
    when available.

[unreleased]: https://github.com/radiojhero/canvas-equalizer/compare/v0.2.0...HEAD
[graphicalfiltereditor]: https://github.com/carlosrafaelgn/GraphicalFilterEditor
