canvas-equalizer
================

[![Version](http://badge.fury.io/gh/kantoradio%2Fcanvas-equalizer.svg)](http://badge.fury.io/gh/kantoradio%2Fcanvas-equalizer)
[![Dependencies status](https://david-dm.org/kantoradio/canvas-equalizer.svg)](https://david-dm.org/kantoradio/canvas-equalizer)
[![Dev dependencies status](https://david-dm.org/kantoradio/canvas-equalizer/dev-status.svg)](https://david-dm.org/kantoradio/canvas-equalizer?type=dev)

This package allows you to graphically edit an equalizer filter and apply it to
songs in real time. You can also apply the filter to an entire song and
download a WAVE file with the filtered song. Check out the live sample on the
project's website: https://opensource.kantorad.io/canvas-equalizer/

This is a fork of Carlos Rafael Gimenes das Neves's port of his own old C++
graphic equalizer to Web technologies, with a few important differences:

-   Analyser files have been moved to the demo;
-   The demo is on its own branch;
-   Everything but the demo has been ported to TypeScript;
-   Styles ported to SASS;
-   Refactored mouse and touch event handling to use Pointer Events
    when available;
-   Responsive UI (including DPI awareness);
-   Built using Webpack;
-   Code linting;
-   Localization and internationalization;
-   RTL support;
-   Can be installed via NPM or Yarn.


Installation
------------

Install it with one of the following commands:

```bash
$ yarn add canvas-equalizer
# or
$ npm install --save canvas-equalizer
```

Then, you need to import the module:

```js
import CanvasEqualizer from 'canvas-equalizer'; // ES6, TypeScript
var CanvasEqualizer = require('canvas-equalizer'); // CommonJS
```

Or, if you've installed it via Bower (will add `CanvasEqualizer` to the
global scope):

```html
<script src="bower_components/canvas-equalizer/dist/CanvasEqualizer.js"></script>
```

Last, but not least: the `CanvasEqualizer.css` stylesheet includes styles for
the UI, including its "status bar".


Usage
-----

```js
const equalizer = new CanvasEqualizer(
    // the FFT size; must be a power of 2 not less than 8 (recommended: 2048)
    filterLength,

    // an AudioContext object
    audioContext, 

    // additional, optional parameters with respective defaults
    {
        // whether to update the filter as the user drags the UI around;
        // `false` means the filter is updated only when dragging is done
        updateFilterOnDrag: false,

        // the prefix for all CSS classes used by the UI
        classNamespace: 'GE',

        // the UI language
        language: 'en'

        filterOptions: {
            // how many points the curves will actually have in the UI
            visibleBinCount: 512,
            
            // when needed, the height of a point in the curve will be
            // converted from the dB range (+40 dB to -40 dB) to an integer
            // range (zero to this value); must be an odd number
            validYRangeHeight: 255
        }
    }
);

// create and attach, e.g., a MediaElementSourceNode:
const audio = new Audio('https://example.com/sound.mp3');
const source = audioContext.createMediaElementSource(audio);
source.connect(equalizer.convolver);
equalizer.convolver.connect(audioContext.destination);

// expose the UI:
equalizer.createControl(document.getElementById('myelement'));

// change the UI language (`src/locales` contains the translation strings):
equalizer.loadLocale('pt-BR', {/* object containing translation strings */});
equalizer.language = 'pt-BR';

// reset the curves:
equalizer.reset();

// destroy the UI:
equalizer.destroyControl();

// more properties:
equalizer.filterLength;
equalizer.sampleRate;
equalizer.audioContext;
equalizer.visibleFrequencies; // read-only
```

The code in the `demo` folder can be used as a demo on how to load and generate
files during runtime (using the [File API][1] and the [Web Worker API][2]) in
client-side JavaScript.


Compatibility
-------------

This project uses the [Web Audio API][3] and requires a [compliant browser][4]
to run properly. In [Firefox 23 and 24][5], Web Audio API must be enabled
using `about:config`.

[1]: http://www.w3.org/TR/FileAPI/
[2]: http://www.w3.org/TR/workers/
[3]: http://www.w3.org/TR/webaudio/
[4]: http://caniuse.com/audio-api
[5]: https://wiki.mozilla.org/WebAudio_API_Rollout_Status

If running the demo locally, Chrome must be started with the command-line
option `--allow-file-access-from-files`, otherwise you will not be able to load
any files!


License
-------

This project is licensed under the terms of the FreeBSD License.
See `LICENSE.md` for more details.
