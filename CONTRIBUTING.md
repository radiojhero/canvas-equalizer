Contributing
============

Good to see you're interested in contributing to us! Before contributing code
or reporting an issue, you should read this document throughly, as it outlines
all you need to know before doing so. We're a really small team after all, so
following the guidelines here will help us address issues (including *yours*)
more easily.


Setting up development
----------------------

You must install Node.js and (optionally, yet highly recommended) Yarn first.
You can replace `npm` with `yarn` if you did install Yarn.

1.  Fork this repository on GitHub;
2.  Clone it to your machine and `cd` to it;
3.  Run `npm install`;
4.  Run `npm start` to view and monitor your changes in the browser;
5.  If that didn't open a browser window, access `http://localhost:8080/`;
6.  Work your magic.


Opening issues
--------------

-   Use the [issue tracker][1] to report bugs and request features or support.
-   Make sure you've searched all open *and closed* issues before opening yours.
    If your issue has been reported before, you may or may not want to
    participate on it.
-   When reporting a bug, be sure to provide a reduced test case.
-   Be respectful!

[1]: https://github.com/radiojhero/canvas-equalizer/issues


Submitting pull requests
------------------------

-   As with issues, make sure a similar PR wasn't submitted before.
-   Before venturing on something big, open an issue about it first. Let us know
    and evaluate whether your idea is worthwhile, or you may end up wasting time
    on something we might not want to merge into the repository.
-   Don't forget to `npm run lint` before submitting your PR, so as to make sure
    the code adheres to our standards.
-   Remember you can still push more commits to your branch when needed after
    submitting your PR; you'll probably want to do this based on feedback.


Known issues / TODOs / Help wanted
----------------------------------

-   Even though the UI is responsive, the filter curves themselves aren't as
    much in the sense of appearing jagged if the UI dimensions become larger
    enough than `visibleBinCount` (width) and `validYRangeHeight` (height);
-   Some browsers (e.g. Safari) won't process audio from a media element loaded
    from a different origin, even with CORS properly set up;
-   Whenever the filter needs to be updated, the audio sometimes goes silent for
    a really short period of time, but enough to be perceptible in some systems
    and therefore to have me debounce `updateFilterOnDrag` to atenuate this;
-   There's no accessibility at all but for the bottom-right menu;
-   Needs test suites! What a shame... orz
