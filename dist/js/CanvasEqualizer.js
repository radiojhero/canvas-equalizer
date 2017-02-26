/*! canvas-equalizer ~ License: BSD-2-Clause-FreeBSD ~ https://opensource.kantorad.io/canvas-equalizer/ */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CanvasEqualizer"] = factory();
	else
		root["CanvasEqualizer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObj = __webpack_require__(8);
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Sources cannot be null or undefined');
	}

	return Object(val);
}

function assignKey(to, from, key) {
	var val = from[key];

	if (val === undefined || val === null) {
		return;
	}

	if (hasOwnProperty.call(to, key)) {
		if (to[key] === undefined || to[key] === null) {
			throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
		}
	}

	if (!hasOwnProperty.call(to, key) || !isObj(val)) {
		to[key] = val;
	} else {
		to[key] = assign(Object(to[key]), from[key]);
	}
}

function assign(to, from) {
	if (to === from) {
		return to;
	}

	from = Object(from);

	for (var key in from) {
		if (hasOwnProperty.call(from, key)) {
			assignKey(to, from, key);
		}
	}

	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(from);

		for (var i = 0; i < symbols.length; i++) {
			if (propIsEnumerable.call(from, symbols[i])) {
				assignKey(to, from, symbols[i]);
			}
		}
	}

	return to;
}

module.exports = function deepAssign(target) {
	target = toObject(target);

	for (var s = 1; s < arguments.length; s++) {
		assign(target, arguments[s]);
	}

	return target;
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_deep_assign__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_deep_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_deep_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Common__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Equalizer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__L10n__ = __webpack_require__(7);
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * canvas-equalizer is distributed under the FreeBSD License
 *
 * Copyright (c) 2012-2017 Armando Meziat, Carlos Rafael Gimenes das Neves
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 *
 * https://github.com/kantoradio/canvas-equalizer
 */




var defaultOptions = {
    classNamespace: 'GE',
    filterOptions: {},
    updateFilterOnDrag: true
};

var CanvasEqualizer = function () {
    function CanvasEqualizer(filterLength, audioContext) {
        var _this = this;

        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, CanvasEqualizer);

        this._showZones = false;
        this._editZones = false;
        this._isActualChannelCurveNeeded = true;
        this._currentChannelIndex = 0;
        this._isSameFilterLR = true;
        this._drawingMode = 0;
        this._lastDrawX = 0;
        this._lastDrawY = 0;
        this._isRTL = false;
        this._formatFrequencyUnit = function (frequency, compact) {
            var unit = 'Hz';
            if (compact) {
                if (frequency >= 1000) {
                    unit = 'k' + unit;
                    frequency = frequency / 1000;
                }
            }
            return _this._l10n.format('frequency.format', frequency, _this._l10n.get('frequency.unit.' + unit));
        };
        this._wrappedUpdateFilter = function () {
            _this._filter.updateFilter(false);
        };
        // events
        this._btnMnuClick = function (e) {
            if (!e.button) {
                _this._toggleMenu();
            }
        };
        this._mnuChBLClick = function (e) {
            _this._mnuChBClick(e, 0);
        };
        this._mnuChBRClick = function (e) {
            _this._mnuChBClick(e, 1);
        };
        this._mnuChBClick = function (e, channelIndex) {
            if (!e.button) {
                if (!_this._isSameFilterLR || _this._currentChannelIndex !== channelIndex) {
                    if (_this._isSameFilterLR) {
                        _this._currentChannelIndex = channelIndex;
                        _this._filter.channelIndex = -1;
                        _this._filter.updateFilter(true);
                        if (_this._isActualChannelCurveNeeded) {
                            _this._filter.updateActualChannelCurve(channelIndex);
                        }
                        _this._drawCurve();
                    } else {
                        _this._isSameFilterLR = true;
                        _this._filter.copyFilter(channelIndex, 1 - channelIndex);
                        if (_this._currentChannelIndex !== channelIndex) {
                            _this._currentChannelIndex = channelIndex;
                            if (_this._isActualChannelCurveNeeded) {
                                _this._filter.updateActualChannelCurve(channelIndex);
                            }
                            _this._drawCurve();
                        }
                    }
                    _this._checkMenu(_this._mnuChBL, channelIndex === 0);
                    _this._checkMenu(_this._mnuChBR, channelIndex === 1);
                }
            }
        };
        this._mnuChLClick = function (e) {
            _this._mnuChLRClick(e, 0);
        };
        this._mnuChRClick = function (e) {
            _this._mnuChLRClick(e, 1);
        };
        this._mnuChLRClick = function (e, channelIndex) {
            if (!e.button) {
                if (_this._isSameFilterLR || _this._currentChannelIndex !== channelIndex) {
                    if (_this._isSameFilterLR) {
                        _this._isSameFilterLR = false;
                        _this._filter.channelIndex = 1 - _this._currentChannelIndex;
                        _this._filter.updateFilter(false);
                    }
                    if (_this._currentChannelIndex !== channelIndex) {
                        _this._currentChannelIndex = channelIndex;
                        if (_this._isActualChannelCurveNeeded) {
                            _this._filter.updateActualChannelCurve(channelIndex);
                        }
                        _this._drawCurve();
                    }
                    _this._checkMenu(_this._mnuChL, channelIndex === 0);
                    _this._checkMenu(_this._mnuChR, channelIndex === 1);
                }
            }
        };
        this._mnuShowZonesClick = function (e) {
            if (!e.button) {
                _this._showZones = !_this._showZones;
                _this._checkMenu(_this._mnuShowZones, _this._showZones);
                _this._drawCurve();
            }
        };
        this._mnuEditZonesClick = function (e) {
            if (!e.button) {
                _this._editZones = !_this._editZones;
                _this._canvas.classList[_this._editZones ? 'add' : 'remove'](_this._options.classNamespace + 'CNVZON');
                _this._checkMenu(_this._mnuEditZones, _this._editZones);
            }
        };
        this._mnuNormalizeCurvesClick = function (e) {
            if (!e.button) {
                _this._filter.isNormalized = !_this._filter.isNormalized;
                _this._checkMenu(_this._mnuNormalizeCurves, _this._filter.isNormalized);
                if (_this._isActualChannelCurveNeeded) {
                    _this._filter.updateActualChannelCurve(_this._currentChannelIndex);
                    _this._drawCurve();
                }
            }
        };
        this._mnuShowActualClick = function (e) {
            if (!e.button) {
                _this._isActualChannelCurveNeeded = !_this._isActualChannelCurveNeeded;
                _this._checkMenu(_this._mnuShowActual, _this._isActualChannelCurveNeeded);
                if (_this._isActualChannelCurveNeeded) {
                    _this._filter.updateActualChannelCurve(_this._currentChannelIndex);
                }
                _this._drawCurve();
            }
        };
        this._btnMnuKeyDown = function (e) {
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["a" /* keyPressed */])(e, 'ArrowUp', 'ArrowDown')) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["b" /* cancelEvent */])(e);
                _this._toggleMenu(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["a" /* keyPressed */])(e, 'ArrowUp'));
                window.setTimeout(function () {
                    var items = _this._mnu.querySelectorAll('.' + _this._options.classNamespace + 'MNUIT');
                    items[items.length - 1].focus();
                });
            }
        };
        this._mnuKeyDown = function (e) {
            var moveFocus = function moveFocus(elem, down) {
                var siblingProp = down ? 'nextSibling' : 'previousSibling';
                var currentElem = elem;
                do {
                    currentElem = currentElem[siblingProp];
                    if (currentElem instanceof HTMLButtonElement && currentElem.classList.contains(_this._options.classNamespace + 'MNUIT')) {
                        currentElem.focus();
                        return true;
                    }
                } while (currentElem);
                return false;
            };
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["a" /* keyPressed */])(e, 'ArrowUp', 'ArrowDown')) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["b" /* cancelEvent */])(e);
                var down = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["a" /* keyPressed */])(e, 'ArrowDown');
                if (!moveFocus(e.target, down) && down) {
                    _this._btnMnu.focus();
                }
            }
        };
        this._canvasMouseDown = function (e) {
            if (!e.button) {
                if (!_this._drawingMode) {
                    var _elemCoords = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["c" /* elemCoords */])(_this._canvas, e),
                        x = _elemCoords.x,
                        y = _elemCoords.y;

                    var normX = Math.floor(x / _this._widthRatio());
                    var normY = y / _this._heightRatio();
                    if (normX >= 0 && normX < _this._filter.options.visibleBinCount) {
                        _this._drawingMode = 1;
                        if (_this._editZones) {
                            _this._filter.changeZoneY(_this._currentChannelIndex, normX, normY);
                        } else {
                            _this._filter.channelCurves[_this._currentChannelIndex][normX] = _this._filter.clampY(normY);
                            _this._lastDrawX = normX;
                            _this._lastDrawY = normY;
                        }
                        _this._drawCurve();
                        if (_this._canvas.setPointerCapture) {
                            _this._canvas.setPointerCapture(e.pointerId);
                        } else if (!e.clonedFromTouch) {
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["d" /* detachPointer */])(_this._canvas, 'move', _this._canvasMouseMove);
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["d" /* detachPointer */])(_this._canvas, 'up', _this._canvasMouseUp);
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["e" /* attachPointer */])(document, 'move', _this._documentMouseMove, true);
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["e" /* attachPointer */])(document, 'up', _this._documentMouseUp, true);
                        }
                    }
                }
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["b" /* cancelEvent */])(e);
            }
            return true;
        };
        this._canvasMouseUp = function (e) {
            if (_this._drawingMode) {
                _this._drawingMode = 0;
                _this._filter.channelIndex = _this._currentChannelIndex;
                _this._filter.updateFilter(false);
                if (_this._isActualChannelCurveNeeded) {
                    _this._filter.updateActualChannelCurve(_this._currentChannelIndex);
                }
                _this._drawCurve();
                if (_this._canvas.releasePointerCapture) {
                    _this._canvas.releasePointerCapture(e.pointerId);
                } else if (!e.clonedFromTouch) {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["d" /* detachPointer */])(document, 'move', _this._documentMouseMove, true);
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["d" /* detachPointer */])(document, 'up', _this._documentMouseUp, true);
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["e" /* attachPointer */])(_this._canvas, 'move', _this._canvasMouseMove);
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["e" /* attachPointer */])(_this._canvas, 'up', _this._canvasMouseUp);
                }
            }
        };
        this._canvasMouseMove = function (e) {
            var curve = _this._filter.channelCurves[_this._currentChannelIndex];

            var _elemCoords2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["c" /* elemCoords */])(_this._canvas, e),
                x = _elemCoords2.x,
                y = _elemCoords2.y;

            if (_this._drawingMode || x >= 0 && x < _this._canvas.width && y >= 0 && y < _this._canvas.height) {
                var normX = Math.floor(x / _this._widthRatio());
                var normY = y / _this._heightRatio();
                if (normX < 0) {
                    normX = 0;
                } else if (normX >= _this._filter.options.visibleBinCount) {
                    normX = _this._filter.options.visibleBinCount - 1;
                }
                if (_this._drawingMode) {
                    if (_this._editZones) {
                        _this._filter.changeZoneY(_this._currentChannelIndex, normX, normY);
                    } else {
                        if (Math.abs(normX - _this._lastDrawX) > 1) {
                            var delta = (normY - _this._lastDrawY) / Math.abs(normX - _this._lastDrawX);
                            var inc = normX < _this._lastDrawX ? -1 : 1;
                            normY = _this._lastDrawY + delta;
                            var count = Math.abs(normX - _this._lastDrawX) - 1;
                            for (normX = _this._lastDrawX + inc; count > 0; normX += inc, count--) {
                                curve[normX] = _this._filter.clampY(normY);
                                normY += delta;
                            }
                        }
                        curve[normX] = _this._filter.clampY(normY);
                        _this._lastDrawX = normX;
                        _this._lastDrawY = normY;
                    }
                    _this._drawCurve();
                    if (_this._options.updateFilterOnDrag) {
                        // tslint:disable-next-line:no-magic-numbers
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["f" /* throttledFunction */])(_this._wrappedUpdateFilter, 150);
                    }
                } else if (_this._isActualChannelCurveNeeded) {
                    curve = _this._filter.actualChannelCurve;
                }
                _this._setStatusBar(normX, normY, curve[normX]);
                if (_this._drawingMode) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["b" /* cancelEvent */])(e);
                }
            }
            return true;
        };
        this._windowResize = function () {
            _this._fixCanvasSize();
        };
        this._documentMouseMove = function (e) {
            return _this._canvasMouseMove(e);
        };
        this._documentMouseUp = function (e) {
            _this._canvasMouseUp(e);
        };
        this._options = __WEBPACK_IMPORTED_MODULE_0_deep_assign___default()({}, defaultOptions, options);
        this._filter = new __WEBPACK_IMPORTED_MODULE_2__Equalizer__["a" /* default */](filterLength, audioContext, this._options.filterOptions);
        this._l10n = new __WEBPACK_IMPORTED_MODULE_3__L10n__["a" /* default */](this._options.language);
    }

    _createClass(CanvasEqualizer, [{
        key: 'createControl',
        value: function createControl(placeholder) {
            var _this2 = this;

            if (!this._ctx) {
                var createLabel = function createLabel(name, content) {
                    var lbl = document.createElement('div');
                    lbl.className = _clsNS + 'LBL ' + _clsNS + 'LBL' + name;
                    lbl.innerHTML = _this2._l10n.get(content);
                    return lbl;
                };
                var createMenuSep = function createMenuSep() {
                    var s = document.createElement('div');
                    s.className = _clsNS + 'MNUSEP';
                    s.setAttribute('role', 'separator');
                    return s;
                };
                var createMenuLabel = function createMenuLabel(text) {
                    var l = document.createElement('div');
                    l.className = _clsNS + 'MNULBL';
                    l.textContent = _this2._l10n.get(text);
                    return l;
                };
                var createMenuItem = function createMenuItem(text, checkable, checked, clickHandler) {
                    var i = document.createElement('button');
                    i.type = 'button';
                    i.className = _clsNS + 'MNUIT ' + _clsNS + 'CLK';
                    if (checkable) {
                        if (typeof checkable === 'string') {
                            i.dataset['radioGroup'] = checkable;
                            i.setAttribute('role', 'menuitemradio');
                        } else {
                            i.setAttribute('role', 'menuitemcheckbox');
                        }
                        var s = document.createElement('span');
                        s.textContent = typeof checkable === 'string' ? '● ' : '■ ';
                        i.appendChild(s);
                        _this2._checkMenu(i, checked);
                    } else {
                        i.setAttribute('role', 'menuitem');
                    }
                    i.appendChild(document.createTextNode(_this2._l10n.get(text)));
                    if (clickHandler) {
                        i.addEventListener('click', clickHandler);
                    }
                    i.addEventListener('mouseenter', function () {
                        i.focus();
                    });
                    i.addEventListener('mouseleave', function () {
                        i.blur();
                    });
                    return i;
                };
                var _clsNS = this._options.classNamespace;
                this._element = placeholder;
                placeholder.className = _clsNS;
                if (/\bip(?:[ao]d|hone)\b/i.test(navigator.userAgent) && !window.MSStream) {
                    placeholder.classList.add(_clsNS + 'IOS');
                }
                if (getComputedStyle(placeholder).direction === 'rtl') {
                    placeholder.classList.add('RTL');
                    this._isRTL = true;
                }
                placeholder.addEventListener('contextmenu', __WEBPACK_IMPORTED_MODULE_1__Common__["b" /* cancelEvent */]);
                this._stb = document.createElement('div');
                this._stb.className = _clsNS + 'STB';
                placeholder.appendChild(this._stb);
                this._canvas = document.createElement('canvas');
                this._canvas.className = _clsNS + 'CNV';
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["e" /* attachPointer */])(this._canvas, 'down', this._canvasMouseDown);
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["e" /* attachPointer */])(this._canvas, 'move', this._canvasMouseMove);
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["e" /* attachPointer */])(this._canvas, 'up', this._canvasMouseUp);
                this._canvas.addEventListener('contextmenu', __WEBPACK_IMPORTED_MODULE_1__Common__["b" /* cancelEvent */]);
                placeholder.appendChild(this._canvas);
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["g" /* addThrottledEvent */])(window, 'resize', this._windowResize);
                var ctx = this._canvas.getContext('2d');
                if (!ctx) {
                    throw new Error('Unable to get a 2D context.');
                }
                this._ctx = ctx;
                this._stb.appendChild(this._lblCursor = createLabel('CSR', 'cursor.label'));
                this._stb.appendChild(this._lblCurve = createLabel('CRV', 'curve.label'));
                this._stb.appendChild(this._lblFrequency = createLabel('FRQ', 'frequency.label'));
                this._setStatusBar(0, this._filter.zeroChannelValueY, this._filter.zeroChannelValueY);
                this._btnMnu = document.createElement('button');
                this._btnMnu.type = 'button';
                this._btnMnu.className = _clsNS + 'BTN ' + _clsNS + 'CLK';
                this._btnMnu.setAttribute('aria-haspopup', 'true');
                this._btnMnu.setAttribute('aria-label', this._l10n.get('menu'));
                this._btnMnu.addEventListener('click', this._btnMnuClick);
                this._btnMnu.addEventListener('keydown', this._btnMnuKeyDown);
                this._btnMnu.addEventListener('mouseenter', function () {
                    _this2._btnMnu.focus();
                });
                this._btnMnu.addEventListener('mouseleave', function () {
                    _this2._btnMnu.blur();
                });
                this._stb.appendChild(this._btnMnu);
                this._mnu = document.createElement('div');
                this._mnu.className = _clsNS + 'MNU';
                this._mnu.setAttribute('role', 'menu');
                this._mnu.addEventListener('keydown', this._mnuKeyDown);
                this._mnu.appendChild(createMenuLabel('menu.both'));
                this._mnu.appendChild(this._mnuChBL = createMenuItem('menu.both.left', 'curve', true, this._mnuChBLClick));
                this._mnu.appendChild(this._mnuChBR = createMenuItem('menu.both.right', 'curve', false, this._mnuChBRClick));
                this._mnu.appendChild(createMenuSep());
                this._mnu.appendChild(createMenuLabel('menu.one'));
                this._mnu.appendChild(this._mnuChL = createMenuItem('menu.one.left', 'curve', false, this._mnuChLClick));
                this._mnu.appendChild(this._mnuChR = createMenuItem('menu.one.right', 'curve', false, this._mnuChRClick));
                this._mnu.appendChild(createMenuSep());
                this._mnu.appendChild(this._mnuShowZones = createMenuItem('menu.zones', true, false, this._mnuShowZonesClick));
                this._mnu.appendChild(this._mnuEditZones = createMenuItem('menu.zoneEdit', true, false, this._mnuEditZonesClick));
                this._mnu.appendChild(createMenuSep());
                this._mnu.appendChild(this._mnuNormalizeCurves = createMenuItem('menu.normalizeCurves', true, false, this._mnuNormalizeCurvesClick));
                this._mnu.appendChild(this._mnuShowActual = createMenuItem('menu.actualResponse', true, true, this._mnuShowActualClick));
                this._stb.appendChild(this._mnu);
                this._toggleMenu(false);
                this._fixCanvasSize();
                this._drawCurve();
            }
            return this._canvas;
        }
    }, {
        key: 'destroyControl',
        value: function destroyControl() {
            if (this._ctx) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Common__["h" /* removeThrottledEvent */])(window, 'resize', this._windowResize);
                delete this._canvas;
                delete this._lblCursor;
                delete this._lblCurve;
                delete this._lblFrequency;
                delete this._btnMnu;
                delete this._mnu;
                delete this._mnuChBL;
                delete this._mnuChL;
                delete this._mnuChBR;
                delete this._mnuChR;
                delete this._mnuShowZones;
                delete this._mnuEditZones;
                delete this._mnuNormalizeCurves;
                delete this._mnuShowActual;
                delete this._stb;
                delete this._ctx;
                delete this._rangeImage;
                this._element.innerHTML = '';
                delete this._element;
                clearTimeout(this._barHideTimeout);
            }
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._filter.reset();
            this._drawCurve();
        }
    }, {
        key: 'loadLocale',
        value: function loadLocale(language, locale) {
            this._l10n.loadLocale(language, locale);
        }
        /* tslint:disable:no-magic-numbers */

    }, {
        key: '_formatDB',
        value: function _formatDB(dB) {
            if (dB < -40) {
                dB = -Infinity;
            }
            var ret = dB.toLocaleString(this._l10n.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return dB < 0 ? ret.replace('-', '−') : dB === 0 ? '−' + ret : '+' + ret;
        }
    }, {
        key: '_formatFrequency',
        value: function _formatFrequency(frequencyAndEquivalent) {
            var _l10n,
                _this3 = this;

            return (_l10n = this._l10n).format.apply(_l10n, ['frequency.text'].concat(_toConsumableArray(frequencyAndEquivalent.map(function (frequency, i) {
                return _this3._formatFrequencyUnit(frequency, !!i);
            }))));
        }
        /* tslint:enable:no-magic-numbers */

    }, {
        key: '_checkMenu',
        value: function _checkMenu(mnu, chk) {
            function inner(elem, toggle) {
                if (elem) {
                    elem.style.visibility = toggle ? 'visible' : 'hidden';
                    elem.setAttribute('aria-checked', toggle.toString());
                }
            }
            if (chk && mnu.dataset['radioGroup']) {
                [].slice.call(this._mnu.querySelectorAll('[data-radio-group="' + mnu.dataset['radioGroup'] + '"]')).forEach(function (elem) {
                    inner(elem.firstChild, false);
                });
            }
            inner(mnu.firstChild, chk);
        }
    }, {
        key: '_drawCurve',
        value: function _drawCurve() {
            /* tslint:disable:no-magic-numbers */
            // all the 0.5's here are because of this explanation:
            // http://stackoverflow.com/questions/195262/can-i-turn-off-antialiasing-on-an-html-canvas-element
            // "Draw your 1-pixel lines on coordinates like ctx.lineTo(10.5, 10.5). Drawing a one-pixel line
            // over the point (10, 10) means, that this 1 pixel at that position reaches from 9.5 to 10.5 which
            // results in two lines that get drawn on the canvas.
            function pixelRound(x) {
                return Math.round(x) + middleOffset;
            }
            var ctx = this._ctx;
            var canvas = this._canvas;
            var pixelRatio = window.devicePixelRatio;
            var width = canvas.width / pixelRatio;
            var height = canvas.height / pixelRatio;
            var widthRatio = this._widthRatio();
            var heightRatio = this._heightRatio();
            var widthMinus1 = this._filter.options.visibleBinCount - 1;
            var middleOffset = 0.5;
            var curve = this._filter.channelCurves[this._currentChannelIndex];
            if (!ctx) {
                return false;
            }
            ctx.fillStyle = '#303030';
            ctx.fillRect(0, 0, width, height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#5a5a5a';
            ctx.beginPath();
            var x = width + 1 + middleOffset;
            var y = pixelRound(this._filter.zeroChannelValueY * heightRatio);
            ctx.moveTo(x, y);
            while (x > 0) {
                ctx.lineTo(x - 4, y);
                x -= 10;
                ctx.moveTo(x, y);
            }
            ctx.stroke();
            ctx.font = 'bold 10pt Verdana';
            ctx.textAlign = this._isRTL ? 'left' : 'right';
            ctx.fillStyle = '#5a5a5a';
            ctx.fillText("\u200E\u22120dB", this._isRTL ? 1 : width - 1, Math.round(this._filter.zeroChannelValueY * heightRatio) - 2);
            ctx.beginPath();
            x = width - 1 - middleOffset;
            y = pixelRound(this._filter.options.validYRangeHeight * heightRatio);
            ctx.moveTo(x, y);
            while (x > 0) {
                ctx.lineTo(x - 4, y);
                x -= 10;
                ctx.moveTo(x, y);
            }
            ctx.stroke();
            ctx.fillText("\u200E\u2212\u221EdB", this._isRTL ? 1 : width - 1, Math.round(this._filter.options.validYRangeHeight * heightRatio) - 2);
            if (this._showZones) {
                for (var i = this._filter.equivalentZonesFrequencyCount.length - 2; i > 0; i--) {
                    x = pixelRound(this._filter.equivalentZonesFrequencyCount[i] * widthRatio);
                    y = 0;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    while (y < height) {
                        ctx.lineTo(x, y + 4);
                        y += 10;
                        ctx.moveTo(x, y);
                    }
                    ctx.stroke();
                }
            }
            ctx.strokeStyle = this._isActualChannelCurveNeeded && !this._drawingMode ? '#707070' : this._rangeImage;
            ctx.beginPath();
            ctx.moveTo(0.5, pixelRound(curve[0] * heightRatio));
            for (x = 1; x < widthMinus1; x++) {
                ctx.lineTo(pixelRound(x * widthRatio), pixelRound(curve[x] * heightRatio));
            }
            // just to fill up the last pixel!
            ctx.lineTo(Math.round(x * widthRatio) + 1, pixelRound(curve[x] * heightRatio));
            ctx.stroke();
            if (this._isActualChannelCurveNeeded && !this._drawingMode) {
                curve = this._filter.actualChannelCurve;
                ctx.strokeStyle = this._rangeImage;
                ctx.beginPath();
                ctx.moveTo(middleOffset, pixelRound(curve[0] * heightRatio));
                for (x = 1; x < widthMinus1; x++) {
                    ctx.lineTo(pixelRound(x * widthRatio), pixelRound(curve[x] * heightRatio));
                }
                // just to fill up the last pixel!
                ctx.lineTo(Math.round(x * widthRatio) + 1, pixelRound(curve[x] * heightRatio));
                ctx.stroke();
            }
            return true;
            /* tslint:enable:no-magic-numbers */
        }
    }, {
        key: '_widthRatio',
        value: function _widthRatio() {
            return this._canvas.width / window.devicePixelRatio / this._filter.options.visibleBinCount;
        }
    }, {
        key: '_heightRatio',
        value: function _heightRatio() {
            var height = this._stb.clientHeight;
            // tslint:disable-next-line:no-magic-numbers
            return (this._canvas.height / window.devicePixelRatio - height - 5) / this._filter.options.validYRangeHeight;
        }
    }, {
        key: '_fixCanvasSize',
        value: function _fixCanvasSize() {
            this._canvas.style.display = 'none';
            var rect = this._element.getBoundingClientRect();
            var pixelRatio = window.devicePixelRatio;
            this._canvas.style.display = '';
            this._canvas.style.width = rect.width + 'px';
            this._canvas.style.height = rect.height + 'px';
            this._canvas.width = rect.width * pixelRatio;
            this._canvas.height = rect.height * pixelRatio;
            this._ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            /* tslint:disable:no-magic-numbers */
            this._rangeImage = this._ctx.createLinearGradient(0, 0, 0, rect.height - this._stb.clientHeight - 5);
            this._rangeImage.addColorStop(0, '#ff0000');
            this._rangeImage.addColorStop(0.1875, '#ffff00');
            this._rangeImage.addColorStop(0.39453125, '#00ff00');
            this._rangeImage.addColorStop(0.60546875, '#00ffff');
            this._rangeImage.addColorStop(0.796875, '#0000ff');
            this._rangeImage.addColorStop(1, '#ff00ff');
            /* tslint:enable:no-magic-numbers */
            this._drawCurve();
        }
    }, {
        key: '_setLabelParam',
        value: function _setLabelParam(label, text) {
            var span = label.querySelector('span');
            if (span) {
                span.textContent = text;
            }
        }
    }, {
        key: '_setStatusBar',
        value: function _setStatusBar(x, y, curveY) {
            this._setLabelParam(this._lblCursor, this._formatDB(this._filter.yToDB(y)));
            this._setLabelParam(this._lblCurve, this._formatDB(this._filter.yToDB(curveY)));
            this._setLabelParam(this._lblFrequency, this._formatFrequency(this._filter.visibleBinToFrequencyGroup(x)));
        }
    }, {
        key: '_toggleMenu',
        value: function _toggleMenu(toggle) {
            toggle = toggle === undefined ? this._mnu.style.display === 'none' : toggle;
            this._mnu.style.display = toggle ? '' : 'none';
            this._btnMnu.textContent = toggle ? '▼' : '▲';
        }
        // virtual properties

    }, {
        key: 'options',
        get: function get() {
            return __WEBPACK_IMPORTED_MODULE_0_deep_assign___default()({}, defaultOptions, this._options);
        }
    }, {
        key: 'filterLength',
        get: function get() {
            return this._filter.filterLength;
        },
        set: function set(newFilterLength) {
            if (this._filter.filterLength !== newFilterLength) {
                this._filter.filterLength = newFilterLength;
                if (this._isActualChannelCurveNeeded) {
                    this._filter.updateActualChannelCurve(this._currentChannelIndex);
                }
                this._drawCurve();
            }
        }
    }, {
        key: 'sampleRate',
        get: function get() {
            return this._filter.sampleRate;
        },
        set: function set(newSampleRate) {
            if (this._filter.sampleRate !== newSampleRate) {
                this._filter.sampleRate = newSampleRate;
                if (this._isActualChannelCurveNeeded) {
                    this._filter.updateActualChannelCurve(this._currentChannelIndex);
                }
                this._drawCurve();
            }
        }
    }, {
        key: 'audioContext',
        get: function get() {
            return this._filter.audioContext;
        },
        set: function set(newAudioContext) {
            if (this._filter.audioContext !== newAudioContext) {
                this._filter.audioContext = newAudioContext;
            }
        }
    }, {
        key: 'language',
        get: function get() {
            return this._l10n.language;
        },
        set: function set(language) {
            this._l10n.language = language;
        }
    }, {
        key: 'visibleFrequencies',
        get: function get() {
            return this._filter.visibleFrequencies;
        }
    }, {
        key: 'convolver',
        get: function get() {
            return this._filter.convolver;
        }
    }]);

    return CanvasEqualizer;
}();

/* harmony default export */ __webpack_exports__["default"] = CanvasEqualizer;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * canvas-equalizer is distributed under the FreeBSD License
 *
 * Copyright (c) 2012-2017 Armando Meziat, Carlos Rafael Gimenes das Neves
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 *
 * https://github.com/kantoradio/canvas-equalizer
 */

// this is needed as per https://gist.github.com/iamakulov/966b91c0fc6363a16ff0650b51fb991b
// tslint:disable-next-line:no-require-imports

module.exports = __webpack_require__(1).default;

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return attachPointer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return detachPointer; });
/* unused harmony export keyFix */
/* harmony export (immutable) */ __webpack_exports__["a"] = keyPressed;
/* harmony export (immutable) */ __webpack_exports__["b"] = cancelEvent;
/* harmony export (immutable) */ __webpack_exports__["f"] = throttledFunction;
/* harmony export (immutable) */ __webpack_exports__["g"] = addThrottledEvent;
/* harmony export (immutable) */ __webpack_exports__["h"] = removeThrottledEvent;
/* harmony export (immutable) */ __webpack_exports__["c"] = elemCoords;
var _slicedToArray = function () {
    function sliceIterator(arr, i) {
        var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;_e = err;
        } finally {
            try {
                if (!_n && _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }return _arr;
    }return function (arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    };
}();

/**
 * canvas-equalizer is distributed under the FreeBSD License
 *
 * Copyright (c) 2012-2017 Armando Meziat, Carlos Rafael Gimenes das Neves
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 *
 * https://github.com/kantoradio/canvas-equalizer
 */
// miscellaneous functions
(function (window) {
    try {
        new CustomEvent('test');
    } catch (e) {
        return; // no need to polyfill
    }
    // polyfills DOM4 CustomEvent
    function MouseEvent(eventType, params) {
        params = params || { bubbles: false, cancelable: false };
        var mouseEvent = document.createEvent('MouseEvent');
        mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 1, params.screenX, params.screenY, params.clientX, params.clientY, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, 0, null);
        return mouseEvent;
    }
    MouseEvent.prototype = Event.prototype;
    window.MouseEvent = MouseEvent;
})(window);
var attachPointer = void 0;
var detachPointer = void 0;
function wrap(func, wrapper, tag, elem) {
    var wrapperTag = '__' + tag + '_wrapper__';
    if (!func[wrapperTag]) {
        func[wrapperTag] = [];
    }
    unwrap(func, tag, elem);
    func[wrapperTag].push({ elem: elem, wrapper: wrapper });
    return wrapper;
}
function unwrap(func, tag, elem) {
    var wrapperTag = '__' + tag + '_wrapper__';
    var ret = void 0;
    if (func[wrapperTag]) {
        func[wrapperTag] = func[wrapperTag].filter(function (entry, i) {
            if (entry.elem === elem) {
                ret = entry.wrapper;
                return false;
            }
            return true;
        });
    }
    return ret;
}
if (window.PointerEvent) {
    attachPointer = function attachPointer(observable, eventName, targetFunction, capturePhase) {
        observable.addEventListener('pointer' + eventName, targetFunction, capturePhase);
    };
    detachPointer = function detachPointer(observable, eventName, targetFunction, capturePhase) {
        observable.removeEventListener('pointer' + eventName, targetFunction, capturePhase);
    };
} else if ('ontouchend' in document) {
    var mappings = {
        down: ['start'],
        move: ['move'],
        up: ['end', 'cancel']
    };
    attachPointer = function attachPointer(observable, eventName, targetFunction, capturePhase) {
        var wrapper = function wrapper(e) {
            var touch = e.changedTouches[0];
            var pseudoMouse = new MouseEvent('mouse' + eventName, {
                altKey: e.altKey,
                clientX: touch && touch.clientX || 0,
                clientY: touch && touch.clientY || 0,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                screenX: touch && touch.screenX || 0,
                screenY: touch && touch.screenY || 0,
                shiftKey: e.shiftKey
            });
            pseudoMouse.clonedFromTouch = true;
            var result = targetFunction(pseudoMouse);
            if (result === false || pseudoMouse.defaultPrevented) {
                cancelEvent(e);
            }
            return result;
        };
        mappings[eventName].forEach(function (mapping) {
            observable.addEventListener('touch' + mapping, wrap(targetFunction, wrapper, 'touch' + eventName, observable), capturePhase);
        });
    };
    detachPointer = function detachPointer(observable, eventName, targetFunction, capturePhase) {
        mappings[eventName].forEach(function (mapping) {
            observable.removeEventListener('touch' + mapping, unwrap(targetFunction, 'touch' + eventName, observable), capturePhase);
        });
    };
} else {
    attachPointer = function attachPointer(observable, eventName, targetFunction, capturePhase) {
        observable.addEventListener('mouse' + eventName, targetFunction, capturePhase);
    };
    detachPointer = function detachPointer(observable, eventName, targetFunction, capturePhase) {
        observable.removeEventListener('mouse' + eventName, targetFunction, capturePhase);
    };
}
var runningFuncs = [];

/* tslint:disable:no-magic-numbers object-literal-sort-keys */
var keyFix = {
    Backspace: 8,
    '\t': ['Tab', 9],
    '\n': ['Enter', 13],
    Escape: 27,
    End: 35,
    Home: 36,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Delete: 46
};
/* tslint:enable:no-magic-numbers object-literal-sort-keys */
function keyPressed(e) {
    for (var _len = arguments.length, chars = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        chars[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < chars.length; i++) {
        var chr = chars[i];
        if (Object.keys(keyFix).indexOf(chr) !== -1) {
            var _ref = Array.isArray(keyFix[chr]) ? keyFix[chr] : [chr, keyFix[chr]],
                _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                keyCode = _ref2[1];

            if (e.key === key || e.keyCode === keyCode) {
                return true;
            }
        }
    }
    return false;
}
function cancelEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}
function throttledFunction(func, timeout) {
    if (runningFuncs.indexOf(func) === -1) {
        runningFuncs.push(func);
        var wrapper = function wrapper() {
            func();
            runningFuncs.splice(runningFuncs.indexOf(func), 1);
        };
        if (timeout) {
            setTimeout(wrapper, timeout);
        } else {
            requestAnimationFrame(wrapper);
        }
    }
}
function addThrottledEvent(observable, eventName, targetFunction, capturePhase) {
    var running = false;
    var wrapper = function wrapper(e) {
        if (!running) {
            running = true;
            requestAnimationFrame(function () {
                targetFunction(e);
                running = false;
            });
        }
    };
    observable.addEventListener(eventName, wrap(targetFunction, wrapper, 'throttle' + eventName, observable), capturePhase);
}
function removeThrottledEvent(observable, eventName, targetFunction, capturePhase) {
    observable.removeEventListener(eventName, unwrap(targetFunction, 'throttle' + eventName, observable), capturePhase);
}
function elemCoords(elem, e) {
    var rect = elem.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_deep_assign__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_deep_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_deep_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__FFTNR__ = __webpack_require__(6);
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * canvas-equalizer is distributed under the FreeBSD License
 *
 * Copyright (c) 2012-2017 Armando Meziat, Carlos Rafael Gimenes das Neves
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 *
 * https://github.com/kantoradio/canvas-equalizer
 */
/* tslint:disable:no-magic-numbers no-bitwise */


var defaultOptions = {
    validYRangeHeight: 255,
    visibleBinCount: 512
};

var Equalizer = function () {
    function Equalizer(filterLength, audioContext) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, Equalizer);

        Equalizer._validateFilterLength(filterLength);
        this._options = __WEBPACK_IMPORTED_MODULE_0_deep_assign___default()({}, defaultOptions, options);
        this._filterLength = filterLength;
        this._sampleRate = audioContext.sampleRate || 44100;
        this._isNormalized = false;
        this._binCount = (filterLength >>> 1) + 1;
        this._audioContext = audioContext;
        this._filterKernel = audioContext.createBuffer(2, filterLength, this._sampleRate);
        this._convolver = audioContext.createConvolver();
        this._convolver.normalize = false;
        this._convolver.buffer = this._filterKernel;
        this._tmp = new Float32Array(filterLength);
        this._channelCurves = [new Int16Array(this._options.visibleBinCount), new Int16Array(this._options.visibleBinCount)];
        this._actualChannelCurve = new Int16Array(this._options.visibleBinCount);
        this._channelIndex = -1;
        this._zeroChannelValueY = this._options.validYRangeHeight >>> 1;
        this._maximumChannelValue = this._options.validYRangeHeight >>> 1;
        this._minimumChannelValue = -(this._options.validYRangeHeight >>> 1);
        this._minusInfiniteChannelValue = -(this._options.validYRangeHeight >>> 1) - 1;
        this._maximumChannelValueY = 0;
        this._minimumChannelValueY = this._options.validYRangeHeight - 1;
        this._visibleFrequencies = new Float32Array(this._options.visibleBinCount);
        this._equivalentZones = new Uint16Array([31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]);
        /* [0, +9, +9, +18, +35, +36, +70, +72, +72, +72, visibleBinCount] */
        var eqz = [0, 9, 18, 36, 71, 107, 177, 249, 321, 393, 512];
        var ratio = this._options.visibleBinCount / eqz[eqz.length - 1];
        var freqSteps = [5, 5, 5, 5, 10, 10, 20, 40, 80, 89];
        var firstFreqs = [5, 50, 95, 185, 360, 720, 1420, 2860, 5740, 11498];
        var f = firstFreqs[0];
        if (this._options.visibleBinCount !== eqz[eqz.length - 1]) {
            eqz = eqz.map(function (num) {
                return Math.round(num * ratio);
            });
            freqSteps = freqSteps.map(function (num) {
                return num / ratio;
            });
        }
        this._equivalentZonesFrequencyCount = new Float32Array(eqz);
        for (var i = 0, s = 0; i < this._options.visibleBinCount; i++) {
            this._visibleFrequencies[i] = f;
            if (s !== eqz.length - 1 && s !== firstFreqs.length - 1 && i + 1 >= eqz[s + 1]) {
                s++;
                f = firstFreqs[s];
            } else {
                f += freqSteps[s];
            }
        }
        this.reset();
    }

    _createClass(Equalizer, [{
        key: 'reset',
        value: function reset() {
            for (var i = this._options.visibleBinCount - 1; i >= 0; i--) {
                this._channelCurves[0][i] = this._zeroChannelValueY;
                this._channelCurves[1][i] = this._zeroChannelValueY;
                this._actualChannelCurve[i] = this._zeroChannelValueY;
            }
            this.updateFilter(true);
            this.updateActualChannelCurve(0);
        }
    }, {
        key: 'clampY',
        value: function clampY(y) {
            var maxY = this._maximumChannelValueY;
            var minY = this._minimumChannelValueY;
            return y <= maxY ? maxY : y > minY ? this._options.validYRangeHeight + 1 : y;
        }
    }, {
        key: 'yToDB',
        value: function yToDB(y) {
            var maxY = this._maximumChannelValueY;
            var minY = this._minimumChannelValueY;
            return y <= maxY ? 40 : y > minY ? -Infinity : Equalizer._lerp(maxY, 40, minY, -40, y);
        }
    }, {
        key: 'yToMagnitude',
        value: function yToMagnitude(y) {
            // 40dB = 100
            // -40dB = 0.01
            // magnitude = 10 ^ (dB/20)
            // log a (x^p) = p * log a (x)
            // x^p = a ^ (p * log a (x))
            // 10^p = e ^ (p * log e (10))
            var maxY = this._maximumChannelValueY;
            var minY = this._minimumChannelValueY;
            return y <= maxY ? 100 : y > minY ? 0 : Math.exp(Equalizer._lerp(maxY, 2, minY, -2, y) * Math.LN10); // 2 = 40dB/20
        }
    }, {
        key: 'magnitudeToY',
        value: function magnitudeToY(magnitude) {
            // 40dB = 100
            // -40dB = 0.01
            var zcy = this._zeroChannelValueY;
            return magnitude >= 100 ? this._maximumChannelValueY : magnitude < 0.01 ? this._options.validYRangeHeight + 1 : Math.round(zcy - zcy * Math.log(magnitude) / Math.LN10 * 0.5 - 0.4);
        }
    }, {
        key: 'visibleBinToZoneIndex',
        value: function visibleBinToZoneIndex(visibleBinIndex) {
            if (visibleBinIndex >= this._options.visibleBinCount - 1) {
                return this._equivalentZones.length - 1;
            } else if (visibleBinIndex > 0) {
                var z = this._equivalentZonesFrequencyCount;
                for (var i = z.length - 1; i >= 0; i--) {
                    if (visibleBinIndex >= z[i]) {
                        return i;
                    }
                }
            }
            return 0;
        }
    }, {
        key: 'visibleBinToFrequency',
        value: function visibleBinToFrequency(visibleBinIndex) {
            var vf = this._visibleFrequencies;
            var vbc = this._options.visibleBinCount;
            if (visibleBinIndex >= vbc - 1) {
                return vf[vbc - 1];
            } else if (visibleBinIndex > 0) {
                return vf[visibleBinIndex];
            }
            return vf[0];
        }
    }, {
        key: 'visibleBinToFrequencyGroup',
        value: function visibleBinToFrequencyGroup(visibleBinIndex) {
            var ez = this._equivalentZones;
            var vf = this._visibleFrequencies;
            var vbc = this._options.visibleBinCount;
            if (visibleBinIndex >= vbc - 1) {
                return [Math.round(vf[vbc - 1]), Math.round(ez[ez.length - 1])];
            } else if (visibleBinIndex > 0) {
                var ezc = this._equivalentZonesFrequencyCount;
                for (var i = ezc.length - 1; i >= 0; i--) {
                    if (visibleBinIndex >= ezc[i]) {
                        return [Math.round(vf[visibleBinIndex]), Math.round(ez[i])];
                    }
                }
            }
            return [Math.round(vf[0]), Math.round(ez[0])];
        }
    }, {
        key: 'changeZoneY',
        value: function changeZoneY(channelIndex, x, y) {
            var i = this.visibleBinToZoneIndex(x);
            var ii = this._equivalentZonesFrequencyCount[i + 1];
            var cy = this.clampY(y);
            var curve = this._channelCurves[channelIndex];
            for (i = this._equivalentZonesFrequencyCount[i]; i < ii; i++) {
                curve[i] = cy;
            }
        }
    }, {
        key: 'copyFilter',
        value: function copyFilter(sourceChannel, destinationChannel) {
            var src = this._filterKernel.getChannelData(sourceChannel);
            var dst = this._filterKernel.getChannelData(destinationChannel);
            for (var i = this._filterLength - 1; i >= 0; i--) {
                dst[i] = src[i];
            }
            this._convolver.buffer = this._filterKernel;
        }
    }, {
        key: 'updateFilter',
        value: function updateFilter(updateBothChannels) {
            var channelIndex = Math.max(this._channelIndex, 0);
            var isSameFilterLR = channelIndex === -1;
            var filterLength = this._filterLength;
            var curve = this._channelCurves[channelIndex];
            var valueCount = this._options.visibleBinCount;
            var bw = this._sampleRate / filterLength;
            var filterLength2 = filterLength >>> 1;
            var filter = this._filterKernel.getChannelData(channelIndex);
            var _visibleFrequencies = this._visibleFrequencies;
            /* M = filterLength2, so, M_HALF_PI_FFTLEN2 = (filterLength2 * 0.5 * Math.PI) / filterLength2 */
            var M_HALF_PI_FFTLEN2 = 0.5 * Math.PI;
            var invMaxMag = 1;
            var repeat = Number(this._isNormalized) + 1;
            // fill in all filter points, either averaging or interpolating them as necessary
            do {
                repeat--;
                var i = 1;
                var ii = 0;
                // tslint:disable-next-line:no-constant-condition
                while (true) {
                    var freq = bw * i;
                    if (freq >= _visibleFrequencies[0]) {
                        break;
                    }
                    var mag = this.yToMagnitude(curve[0]);
                    filter[i << 1] = mag * invMaxMag;
                    i++;
                }
                while (bw > _visibleFrequencies[ii + 1] - _visibleFrequencies[ii] && i < filterLength2 && ii < valueCount - 1) {
                    var _freq = bw * i;
                    var avg = 0;
                    var avgCount = 0;
                    do {
                        avg += curve[ii];
                        avgCount++;
                        ii++;
                    } while (_freq > _visibleFrequencies[ii] && ii < valueCount - 1);
                    var _mag = this.yToMagnitude(avg / avgCount);
                    filter[i << 1] = _mag * invMaxMag;
                    i++;
                }
                for (; i < filterLength2; i++) {
                    var _freq2 = bw * i;
                    var _mag2 = void 0;
                    if (_freq2 >= _visibleFrequencies[valueCount - 1]) {
                        _mag2 = this.yToMagnitude(curve[valueCount - 1]);
                    } else {
                        while (ii < valueCount - 1 && _freq2 > _visibleFrequencies[ii + 1]) {
                            ii++;
                        }
                        _mag2 = this.yToMagnitude(Equalizer._lerp(_visibleFrequencies[ii], curve[ii], _visibleFrequencies[ii + 1], curve[ii + 1], _freq2));
                    }
                    filter[i << 1] = _mag2 * invMaxMag;
                }
                // since DC and Nyquist are purely real, do not bother with them in the for loop,
                // just make sure neither one has a gain greater than 0 dB
                filter[0] = filter[2] >= 1 ? 1 : filter[2];
                filter[1] = filter[filterLength - 2] >= 1 ? 1 : filter[filterLength - 2];
                // convert the coordinates from polar to rectangular
                for (i = filterLength - 2; i >= 2; i -= 2) {
                    /*                -k.j
                     * polar = Mag . e
                     *
                     * where:
                     * k = (M / 2) * pi * i / (fft length / 2)
                     * i = index varying from 0 to (fft length / 2)
                     *
                     * rectangular:
                     * real = Mag . cos(-k)
                     * imag = Mag . sin(-k)
                     */
                    var k = M_HALF_PI_FFTLEN2 * (i >>> 1);
                    /* ****NOTE:
                     * when using FFTReal ou FFTNR, k MUST BE passed as the argument of sin and cos, due to the
                     * signal of the imaginary component
                     * RFFT, intel and other fft's use the opposite signal... therefore, -k MUST BE passed!!
                     */
                    filter[i + 1] = filter[i] * Math.sin(k);
                    filter[i] *= Math.cos(k);
                }
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__FFTNR__["a" /* FFTReal */])(filter, filterLength, -1);
                if (repeat) {
                    // get the actual filter response, and then, compensate
                    invMaxMag = this._applyWindowAndComputeActualMagnitudes(filter);
                    if (invMaxMag <= 0) {
                        repeat = 0;
                    }
                    invMaxMag = 1.0 / invMaxMag;
                }
            } while (repeat);
            if (isSameFilterLR) {
                // copy the filter to the other channel
                this.copyFilter(channelIndex, 1 - channelIndex);
                return;
            }
            if (updateBothChannels) {
                // update the other channel as well
                var oldChannelIndex = this._channelIndex;
                this._channelIndex = 1 - channelIndex;
                this.updateFilter(false);
                this._channelIndex = oldChannelIndex;
                return;
            }
            this._convolver.buffer = this._filterKernel;
        }
    }, {
        key: 'updateActualChannelCurve',
        value: function updateActualChannelCurve(channelIndex) {
            var filterLength = this._filterLength;
            var curve = this._actualChannelCurve;
            var valueCount = this._options.visibleBinCount;
            var bw = this._sampleRate / filterLength;
            var filterLength2 = filterLength >>> 1;
            var tmp = this._tmp;
            var _visibleFrequencies = this._visibleFrequencies;
            var filter = this._filterKernel.getChannelData(channelIndex);
            this._applyWindowAndComputeActualMagnitudes(filter);
            // tmp now contains (filterLength2 + 1) magnitudes
            var i = 0;
            var ii = 0;
            while (ii < valueCount - 1 && i < filterLength2 && bw > _visibleFrequencies[ii + 1] - _visibleFrequencies[ii]) {
                var freq = bw * i;
                while (i < filterLength2 && freq + bw < _visibleFrequencies[ii]) {
                    i++;
                    freq = bw * i;
                }
                curve[ii] = this.magnitudeToY(Equalizer._lerp(freq, tmp[i], freq + bw, tmp[i + 1], _visibleFrequencies[ii]));
                ii++;
            }
            i++;
            while (i < filterLength2 && ii < valueCount) {
                var _freq3 = void 0;
                var avg = 0;
                var avgCount = 0;
                do {
                    avg += tmp[i];
                    avgCount++;
                    i++;
                    _freq3 = bw * i;
                } while (_freq3 < _visibleFrequencies[ii] && i < filterLength2);
                curve[ii] = this.magnitudeToY(avg / avgCount);
                ii++;
            }
            i = this._sampleRate >>> 1 >= _visibleFrequencies[valueCount - 1] ? curve[ii - 1] : this._options.validYRangeHeight + 1;
            for (; ii < valueCount; ii++) {
                curve[ii] = i;
            }
        }
    }, {
        key: '_applyWindowAndComputeActualMagnitudes',
        value: function _applyWindowAndComputeActualMagnitudes(filter) {
            var filterLength = this._filterLength;
            var tmp = this._tmp;
            var filterLength2 = filterLength >>> 1;
            var M = filterLength2;
            var PI2_M = 2 * Math.PI / M;
            // it is not possible to know what kind of window the browser will use,
            // so make an assumption here... Blackman window!
            // ...at least it is the one I used, back in C++ times :)
            for (var i = M; i >= 0; i--) {
                /* Hanning window */
                // tmp[i] = filter[i] * (0.5 - (0.5 * cos(PI2_M * i)));
                /* Hamming window */
                // tmp[i] = filter[i] * (0.54 - (0.46 * cos(PI2_M * i)));
                /* Blackman window */
                tmp[i] = filter[i] * (0.42 - 0.5 * Math.cos(PI2_M * i) + 0.08 * Math.cos(2 * PI2_M * i));
            }
            for (var _i = filterLength - 1; _i > M; _i--) {
                tmp[_i] = 0;
            }
            // calculate the spectrum
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__FFTNR__["a" /* FFTReal */])(tmp, filterLength, 1);
            // save Nyquist for later
            var ii = tmp[1];
            var maxMag = tmp[0] > ii ? tmp[0] : ii;
            for (var _i2 = 2; _i2 < filterLength; _i2 += 2) {
                var rval = tmp[_i2];
                var ival = tmp[_i2 + 1];
                var mag = Math.sqrt(rval * rval + ival * ival);
                tmp[_i2 >>> 1] = mag;
                if (mag > maxMag) {
                    maxMag = mag;
                }
            }
            // restore Nyquist in its new position
            tmp[filterLength2] = ii;
            return maxMag;
        }
    }, {
        key: 'filterLength',

        // virtual properties
        get: function get() {
            return this._filterLength;
        },
        set: function set(newFilterLength) {
            if (this._filterLength !== newFilterLength) {
                Equalizer._validateFilterLength(newFilterLength);
                this._filterLength = newFilterLength;
                this._binCount = (newFilterLength >>> 1) + 1;
                this._filterKernel = this._audioContext.createBuffer(2, newFilterLength, this._sampleRate);
                this._tmp = new Float32Array(newFilterLength);
                this.updateFilter(true);
            }
        }
    }, {
        key: 'sampleRate',
        get: function get() {
            return this._sampleRate;
        },
        set: function set(newSampleRate) {
            if (this.sampleRate !== newSampleRate) {
                this._sampleRate = newSampleRate;
                this._filterKernel = this._audioContext.createBuffer(2, this._filterLength, newSampleRate);
                this.updateFilter(true);
            }
        }
    }, {
        key: 'isNormalized',
        get: function get() {
            return this._isNormalized;
        },
        set: function set(isNormalized) {
            if (this.isNormalized !== isNormalized) {
                this._isNormalized = isNormalized;
                this.updateFilter(true);
            }
        }
    }, {
        key: 'audioContext',
        get: function get() {
            return this._audioContext;
        },
        set: function set(newAudioContext) {
            if (this.audioContext !== newAudioContext) {
                this._convolver.disconnect(0);
                this._audioContext = newAudioContext;
                this._filterKernel = newAudioContext.createBuffer(2, this._filterLength, this._sampleRate);
                this._convolver = newAudioContext.createConvolver();
                this._convolver.normalize = false;
                this._convolver.buffer = this._filterKernel;
                this.updateFilter(true);
            }
        }
    }, {
        key: 'options',
        get: function get() {
            return __WEBPACK_IMPORTED_MODULE_0_deep_assign___default()({}, defaultOptions, this._options);
        }
    }, {
        key: 'visibleFrequencies',
        get: function get() {
            return this._visibleFrequencies;
        }
    }, {
        key: 'channelCurves',
        get: function get() {
            return this._channelCurves.slice();
        }
    }, {
        key: 'actualChannelCurve',
        get: function get() {
            return this._actualChannelCurve;
        }
    }, {
        key: 'convolver',
        get: function get() {
            return this._convolver;
        }
    }, {
        key: 'channelIndex',
        get: function get() {
            return this._channelIndex;
        },
        set: function set(newChannelIndex) {
            this._channelIndex = newChannelIndex;
        }
    }, {
        key: 'zeroChannelValueY',
        get: function get() {
            return this._zeroChannelValueY;
        }
    }, {
        key: 'equivalentZonesFrequencyCount',
        get: function get() {
            return this._equivalentZonesFrequencyCount;
        }
    }], [{
        key: '_validateFilterLength',
        value: function _validateFilterLength(filterLength) {
            if (filterLength < 8 || filterLength & filterLength - 1) {
                throw new Error('The FFT size must be power of 2 and not less than 8.');
            }
        }
    }, {
        key: '_lerp',
        value: function _lerp(x0, y0, x1, y1, x) {
            return (x - x0) * (y1 - y0) / (x1 - x0) + y0;
        }
    }]);

    return Equalizer;
}();

/* harmony default export */ __webpack_exports__["a"] = Equalizer;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export FFTComplex */
/* harmony export (immutable) */ __webpack_exports__["a"] = FFTReal;
/**
 * canvas-equalizer is distributed under the FreeBSD License
 *
 * Copyright (c) 2012-2017 Armando Meziat, Carlos Rafael Gimenes das Neves
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 *
 * https://github.com/kantoradio/canvas-equalizer
 */
/*==============================================================================
 *
 * This algorithm is an adaptation of the algorithm from the hardcover
 * book "Numerical Recipes: The Art of Scientific Computing, 3rd Edition",
 * with some additional optimizations and changes.
 *
 * I HIGHLY recommend this book!!! :D
 *
 *==============================================================================
 */
/* Ordering of data
 * time [0]          | Real [bin 0]
 * time [1]          | Real [bin length/2]
 * time [2]          | Real [bin 1]
 * time [3]          | Imag [bin 1]
 * time [...]        | Real [bin ...]
 * time [...]        | Imag [bin ...]
 * time [length-2]   | Real [bin length/2-1]
 * time [length-1]   | Imag [bin length/2-1]
 */
/* tslint:disable:no-magic-numbers no-bitwise */
/**
 * canvas-equalizer is distributed under the FreeBSD License
 *
 * Copyright (c) 2012-2017 Armando Meziat, Carlos Rafael Gimenes das Neves
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 *
 * https://github.com/kantoradio/canvas-equalizer
 */function FFTComplex(data, n, isign) {
    var nn = n << 1;
    var mmax = void 0;
    var m = void 0;
    var j = 1;
    var istep = void 0;
    var i = void 0;
    var wr = void 0;
    var wpr = void 0;
    var wpi = void 0;
    var wi = void 0;
    var theta = void 0;
    var tempr = void 0;
    var tempi = void 0;
    var halfmmax = void 0;
    var dj1 = void 0;
    var dj = void 0;
    // bit reversal swap
    for (i = 1; i < nn; i += 2) {
        if (j > i) {
            tempr = data[j - 1];
            data[j - 1] = data[i - 1];
            data[i - 1] = tempr;
            tempr = data[j];
            data[j] = data[i];
            data[i] = tempr;
        }
        m = n;
        while (m >= 2 && j > m) {
            j -= m;
            m >>>= 1;
        }
        j += m;
    }
    // first pass (mmax = 2 / wr = 1 / wi = 0)
    for (i = 1; i <= nn; i += 4) {
        j = i + 2;
        tempr = data[j - 1];
        tempi = data[j];
        data[j - 1] = data[i - 1] - tempr;
        data[j] = data[i] - tempi;
        data[i - 1] += tempr;
        data[i] += tempi;
    }
    /* I decided not to unroll the following steps in favor of the cache memory
     // second pass (mmax = 4 / wr = 1 / wi = 0) A
    for (i = 1; i <= nn; i += 8) {
        j = i + 4;
        tempr = data[j - 1];
        tempi = data[j];
        data[j - 1] = data[i - 1] - tempr;
        data[j] = data[i] - tempi;
        data[i - 1] += tempr;
        data[i] += tempi;
    }
     // second pass (mmax = 4 / wr = 0 / wi = isign) B
    if (isign === 1) {
        for (i = 3; i <= nn; i += 8) {
            j = i + 4;
            tempr = -data[j];
            tempi = data[j - 1];
            data[j - 1] = data[i - 1] - tempr;
            data[j] = data[i] - tempi;
            data[i - 1] += tempr;
            data[i] += tempi;
        }
    }
    else {
        for (i = 3; i <= nn; i += 8) {
            j = i + 4;
            tempr = data[j];
            tempi = -data[j - 1];
            data[j - 1] = data[i - 1] - tempr;
            data[j] = data[i] - tempi;
            data[i - 1] += tempr;
            data[i] += tempi;
        }
    }
     mmax = 8;
    theta = isign * Math.PI * 0.25;
    */
    mmax = 4;
    theta = isign * Math.PI * 0.5;
    while (nn > mmax) {
        istep = mmax << 1;
        wpi = Math.sin(theta);
        theta *= 0.5;
        wpr = Math.sin(theta);
        wpr *= -2.0 * wpr;
        // ---------------------------------------------
        // special case for the inner loop when m = 1:
        // wr = 1 / wi = 0
        for (i = 1; i <= nn; i += istep) {
            j = i + mmax;
            tempr = data[j - 1];
            tempi = data[j];
            data[j - 1] = data[i - 1] - tempr;
            data[j] = data[i] - tempi;
            data[i - 1] += tempr;
            data[i] += tempi;
        }
        wr = 1.0 + wpr;
        wi = wpi;
        // ---------------------------------------------
        halfmmax = (mmax >>> 1) + 1;
        for (m = 3; m < halfmmax; m += 2) {
            for (i = m; i <= nn; i += istep) {
                j = i + mmax;
                tempr = wr * (dj1 = data[j - 1]) - wi * (dj = data[j]);
                tempi = wr * dj + wi * dj1;
                data[j - 1] = data[i - 1] - tempr;
                data[j] = data[i] - tempi;
                data[i - 1] += tempr;
                data[i] += tempi;
            }
            wr += (tempr = wr) * wpr - wi * wpi;
            wi += wi * wpr + tempr * wpi;
        }
        // ---------------------------------------------
        // special case for the inner loop when m = ((mmax >>> 1) + 1):
        // wr = 0 / wi = isign
        if (isign === 1) {
            for (i = m; i <= nn; i += istep) {
                j = i + mmax;
                tempr = -data[j];
                tempi = data[j - 1];
                data[j - 1] = data[i - 1] - tempr;
                data[j] = data[i] - tempi;
                data[i - 1] += tempr;
                data[i] += tempi;
            }
            wr = -wpi;
            wi = 1.0 + wpr;
        } else {
            for (i = m; i <= nn; i += istep) {
                j = i + mmax;
                tempr = data[j];
                tempi = -data[j - 1];
                data[j - 1] = data[i - 1] - tempr;
                data[j] = data[i] - tempi;
                data[i - 1] += tempr;
                data[i] += tempi;
            }
            wr = wpi;
            wi = -1.0 - wpr;
        }
        m += 2;
        // ---------------------------------------------
        for (; m < mmax; m += 2) {
            for (i = m; i <= nn; i += istep) {
                j = i + mmax;
                tempr = wr * (dj1 = data[j - 1]) - wi * (dj = data[j]);
                tempi = wr * dj + wi * dj1;
                data[j - 1] = data[i - 1] - tempr;
                data[j] = data[i] - tempi;
                data[i - 1] += tempr;
                data[i] += tempi;
            }
            wr += (tempr = wr) * wpr - wi * wpi;
            wi += wi * wpr + tempr * wpi;
        }
        mmax = istep;
    }
}
function FFTReal(data, n, isign) {
    var i = void 0;
    var i1 = void 0;
    var i2 = void 0;
    var i3 = void 0;
    var i4 = void 0;
    var d1 = void 0;
    var d2 = void 0;
    var d3 = void 0;
    var d4 = void 0;
    var n4 = n >>> 2;
    var c2 = void 0;
    var h1r = void 0;
    var h1i = void 0;
    var h2r = void 0;
    var h2i = void 0;
    var wr = void 0;
    var wi = void 0;
    var wpr = void 0;
    var wpi = void 0;
    var theta = Math.PI / (n >>> 1);
    if (isign === 1) {
        c2 = -0.5;
        FFTComplex(data, n >>> 1, 1);
    } else {
        c2 = 0.5;
        theta = -theta;
    }
    wpr = Math.sin(0.5 * theta);
    wr = 1.0 + (wpr *= -2.0 * wpr);
    wi = wpi = Math.sin(theta);
    for (i = 1; i < n4; i++) {
        i2 = 1 + (i1 = i << 1);
        i4 = 1 + (i3 = n - i1);
        h1r = 0.5 * ((d1 = data[i1]) + (d3 = data[i3]));
        h1i = 0.5 * ((d2 = data[i2]) - (d4 = data[i4]));
        h2r = -c2 * (d2 + d4);
        h2i = c2 * (d1 - d3);
        data[i1] = h1r + (d1 = wr * h2r) - (d2 = wi * h2i);
        data[i2] = h1i + (d3 = wr * h2i) + (d4 = wi * h2r);
        data[i3] = h1r - d1 + d2;
        data[i4] = d3 + d4 - h1i;
        wr += (h1r = wr) * wpr - wi * wpi;
        wi += wi * wpr + h1r * wpi;
    }
    if (isign === 1) {
        data[0] = (h1r = data[0]) + data[1];
        data[1] = h1r - data[1];
    } else {
        data[0] = 0.5 * ((h1r = data[0]) + data[1]);
        data[1] = 0.5 * (h1r - data[1]);
        FFTComplex(data, n >>> 1, -1);
        h1r = 2.0 / n;
        for (i = n - 1; i >= 0; i--) {
            data[i] *= h1r;
        }
    }
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locales_en_json__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locales_en_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__locales_en_json__);
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * canvas-equalizer is distributed under the FreeBSD License
 *
 * Copyright (c) 2012-2017 Armando Meziat, Carlos Rafael Gimenes das Neves
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 *
 * https://github.com/kantoradio/canvas-equalizer
 */

var defaultLanguage = 'en';

var L10n = function () {
    function L10n() {
        var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultLanguage;

        _classCallCheck(this, L10n);

        this._locales = {};
        this._language = language;
        this.loadLocale(defaultLanguage, __WEBPACK_IMPORTED_MODULE_0__locales_en_json___default.a);
    }

    _createClass(L10n, [{
        key: 'loadLocale',
        value: function loadLocale(language, locale) {
            this._locales[language] = locale;
        }
    }, {
        key: 'get',
        value: function get(tag) {
            var locales = this._locales[this._language] || this._locales[defaultLanguage];
            if (locales[tag] === undefined) {
                locales = this._locales[defaultLanguage];
            }
            return locales[tag];
        }
    }, {
        key: 'format',
        value: function format(str) {
            var _this = this;

            str = this.get(str);

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            args.forEach(function (arg, i) {
                str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), arg.toLocaleString(_this._language));
            });
            return str;
        }
    }, {
        key: 'language',
        get: function get() {
            return this._language;
        },
        set: function set(language) {
            this._language = language;
        }
    }]);

    return L10n;
}();

/* harmony default export */ __webpack_exports__["a"] = L10n;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (x) {
	var type = typeof x;
	return x !== null && (type === 'object' || type === 'function');
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {
	"cursor.label": "Cursor: <span></span> dB",
	"curve.label": "Curve: <span></span> dB",
	"frequency.label": "Frequency: <span></span>",
	"frequency.text": "{0} ({1})",
	"frequency.format": "{0} {1}",
	"frequency.unit.Hz": "Hz",
	"frequency.unit.kHz": "kHz",
	"menu": "Options",
	"menu.both": "Same curve for both channels",
	"menu.both.left": "Use left curve",
	"menu.both.right": "Use right curve",
	"menu.one": "One curve for each channel",
	"menu.one.left": "Show left curve",
	"menu.one.right": "Show right curve",
	"menu.zones": "Show zones",
	"menu.zoneEdit": "Edit by zones",
	"menu.normalizeCurves": "Normalize curves",
	"menu.actualResponse": "Show actual response"
};

/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);
});
//# sourceMappingURL=CanvasEqualizer.js.map