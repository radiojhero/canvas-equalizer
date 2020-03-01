/**
 * canvas-equalizer is distributed under the FreeBSD License
 *
 * Copyright (c) 2012-2020 Armando Meziat, Carlos Rafael Gimenes das Neves
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
 * https://github.com/radiojhero/canvas-equalizer
 */

import deepAssign from 'deep-assign';

import {
    keyPressed,
    elementCoordinates,
    attachPointer,
    detachPointer,
    cancelEvent,
    throttledFunction,
    addThrottledEvent,
    removeThrottledEvent,
    devicePixelRatio,
} from './Common';

import Equalizer from './Equalizer';
import L10n, { Locale } from './L10n';

import CanvasEqualizerOptions from './CanvasEqualizerOptions';

const defaultOptions: CanvasEqualizerOptions = {
    classNamespace: 'GE',
    filterOptions: {},
    updateFilterOnDrag: true,
};

export default class CanvasEqualizer {
    private _options: Required<CanvasEqualizerOptions>;
    private _filter: Equalizer;
    private _element: HTMLElement;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _rangeImage: CanvasGradient;
    private _btnMnu: HTMLButtonElement;
    private _mnu: HTMLElement;
    private _mnuChBL: HTMLButtonElement;
    private _mnuChL: HTMLButtonElement;
    private _mnuChBR: HTMLButtonElement;
    private _mnuChR: HTMLButtonElement;
    private _mnuShowZones: HTMLButtonElement;
    private _mnuEditZones: HTMLButtonElement;
    private _mnuNormalizeCurves: HTMLButtonElement;
    private _mnuShowActual: HTMLButtonElement;
    private _lblCursor: HTMLElement;
    private _lblCurve: HTMLElement;
    private _lblFrequency: HTMLElement;
    private _stb: HTMLElement;
    private _showZones = false;
    private _editZones = false;
    private _isActualChannelCurveNeeded = true;
    private _currentChannelIndex = 0;
    private _isSameFilterLR = true;
    private _drawingMode = 0;
    private _lastDrawX = 0;
    private _lastDrawY = 0;
    private _barHideTimeout: number;
    private _l10n: L10n;
    private _isRTL = false;

    constructor(
        filterLength: number,
        audioContext: AudioContext,
        options: CanvasEqualizerOptions = {},
    ) {
        this._options = deepAssign(
            {} as Required<CanvasEqualizerOptions>,
            defaultOptions,
            options,
        );
        this._filter = new Equalizer(
            filterLength,
            audioContext,
            this._options.filterOptions,
        );
        this._l10n = new L10n(this._options.language);
    }

    public createControl(placeholder: HTMLElement) {
        if (!this._context) {
            const classNamespace = this._options.classNamespace;

            const createLabel = (name: string, content: string) => {
                const lbl = document.createElement('div');
                lbl.className = `${classNamespace}LBL ${classNamespace}LBL${name}`;
                lbl.innerHTML = this._l10n.get(content);
                return lbl;
            };
            const createMenuSeparator = () => {
                const s = document.createElement('div');
                s.className = `${classNamespace}MNUSEP`;
                s.setAttribute('role', 'separator');
                return s;
            };
            const createMenuLabel = (text: string) => {
                const l = document.createElement('div');
                l.className = `${classNamespace}MNULBL`;
                l.textContent = this._l10n.get(text);
                return l;
            };
            const createMenuItem = (
                text: string,
                checkable: boolean | string,
                checked: boolean,
                clickHandler: (e: MouseEvent) => any,
            ) => {
                const i = document.createElement('button');
                i.type = 'button';
                i.className = `${classNamespace}MNUIT ${classNamespace}CLK`;

                if (checkable) {
                    if (typeof checkable === 'string') {
                        i.dataset['radioGroup'] = checkable;
                        i.setAttribute('role', 'menuitemradio');
                    } else {
                        i.setAttribute('role', 'menuitemcheckbox');
                    }

                    const s = document.createElement('span');
                    s.textContent = typeof checkable === 'string' ? '● ' : '■ ';
                    i.appendChild(s);
                    this._checkMenu(i, checked);
                } else {
                    i.setAttribute('role', 'menuitem');
                }

                i.appendChild(document.createTextNode(this._l10n.get(text)));

                if (clickHandler) {
                    i.addEventListener('click', clickHandler);
                }

                i.addEventListener('mouseenter', () => {
                    i.focus();
                });
                i.addEventListener('mouseleave', () => {
                    i.blur();
                });

                return i;
            };

            this._element = placeholder;
            placeholder.className = classNamespace;

            if (
                /\bip(?:[ao]d|hone)\b/i.test(navigator.userAgent) &&
                !(window as any).MSStream
            ) {
                placeholder.classList.add(`${classNamespace}IOS`);
            }

            if (getComputedStyle(placeholder).direction === 'rtl') {
                placeholder.classList.add('RTL');
                this._isRTL = true;
            }

            placeholder.addEventListener('contextmenu', cancelEvent);

            this._stb = document.createElement('div');
            this._stb.className = `${classNamespace}STB`;
            placeholder.appendChild(this._stb);

            this._canvas = document.createElement('canvas');
            this._canvas.className = `${classNamespace}CNV`;
            attachPointer(this._canvas, 'down', this._canvasMouseDown);
            attachPointer(this._canvas, 'move', this._canvasMouseMove);
            attachPointer(this._canvas, 'up', this._canvasMouseUp);
            this._canvas.addEventListener('contextmenu', cancelEvent);
            placeholder.appendChild(this._canvas);
            addThrottledEvent(window, 'resize', this._windowResize);

            const context = this._canvas.getContext('2d');

            if (!context) {
                throw new Error('Unable to get a 2D context.');
            }

            this._context = context;

            this._stb.appendChild(
                (this._lblCursor = createLabel('CSR', 'cursor.label')),
            );
            this._stb.appendChild(
                (this._lblCurve = createLabel('CRV', 'curve.label')),
            );
            this._stb.appendChild(
                (this._lblFrequency = createLabel('FRQ', 'frequency.label')),
            );
            this._setStatusBar(
                0,
                this._filter.zeroChannelValueY,
                this._filter.zeroChannelValueY,
            );

            this._btnMnu = document.createElement('button');
            this._btnMnu.type = 'button';
            this._btnMnu.className = `${classNamespace}BTN ${classNamespace}CLK`;
            this._btnMnu.setAttribute('aria-haspopup', 'true');
            this._btnMnu.setAttribute('aria-label', this._l10n.get('menu'));
            this._btnMnu.addEventListener('click', this._btnMnuClick);
            this._btnMnu.addEventListener('keydown', this._btnMnuKeyDown);
            this._btnMnu.addEventListener('mouseenter', () => {
                this._btnMnu.focus();
            });
            this._btnMnu.addEventListener('mouseleave', () => {
                this._btnMnu.blur();
            });
            this._stb.appendChild(this._btnMnu);

            this._mnu = document.createElement('div');
            this._mnu.className = `${classNamespace}MNU`;
            this._mnu.setAttribute('role', 'menu');
            this._mnu.addEventListener('keydown', this._mnuKeyDown);
            this._mnu.appendChild(createMenuLabel('menu.both'));
            this._mnu.appendChild(
                (this._mnuChBL = createMenuItem(
                    'menu.both.left',
                    'curve',
                    true,
                    this._mnuChBLClick,
                )),
            );
            this._mnu.appendChild(
                (this._mnuChBR = createMenuItem(
                    'menu.both.right',
                    'curve',
                    false,
                    this._mnuChBRClick,
                )),
            );
            this._mnu.appendChild(createMenuSeparator());
            this._mnu.appendChild(createMenuLabel('menu.one'));
            this._mnu.appendChild(
                (this._mnuChL = createMenuItem(
                    'menu.one.left',
                    'curve',
                    false,
                    this._mnuChLClick,
                )),
            );
            this._mnu.appendChild(
                (this._mnuChR = createMenuItem(
                    'menu.one.right',
                    'curve',
                    false,
                    this._mnuChRClick,
                )),
            );
            this._mnu.appendChild(createMenuSeparator());
            this._mnu.appendChild(
                (this._mnuShowZones = createMenuItem(
                    'menu.zones',
                    true,
                    false,
                    this._mnuShowZonesClick,
                )),
            );
            this._mnu.appendChild(
                (this._mnuEditZones = createMenuItem(
                    'menu.zoneEdit',
                    true,
                    false,
                    this._mnuEditZonesClick,
                )),
            );
            this._mnu.appendChild(createMenuSeparator());
            this._mnu.appendChild(
                (this._mnuNormalizeCurves = createMenuItem(
                    'menu.normalizeCurves',
                    true,
                    false,
                    this._mnuNormalizeCurvesClick,
                )),
            );
            this._mnu.appendChild(
                (this._mnuShowActual = createMenuItem(
                    'menu.actualResponse',
                    true,
                    true,
                    this._mnuShowActualClick,
                )),
            );
            this._stb.appendChild(this._mnu);
            this._toggleMenu(false);

            this._fixCanvasSize();
            this._drawCurve();
        }
        return this._canvas;
    }

    public destroyControl() {
        if (this._context) {
            removeThrottledEvent(window, 'resize', this._windowResize);
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
            delete this._context;
            delete this._rangeImage;
            this._element.innerHTML = '';
            delete this._element;
            clearTimeout(this._barHideTimeout);
        }
    }

    public reset() {
        this._filter.reset();
        this._drawCurve();
    }

    public loadLocale(language: string, locale: Locale) {
        this._l10n.loadLocale(language, locale);
    }

    /* tslint:disable:no-magic-numbers */
    private _formatDB(dB: number) {
        if (dB < -40) {
            dB = -Infinity;
        }

        const returnValue = dB.toLocaleString(this._l10n.language, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return dB < 0
            ? returnValue.replace('-', '−')
            : dB === 0
            ? '−' + returnValue
            : '+' + returnValue;
    }

    private _formatFrequencyUnit = (frequency: number, compact: boolean) => {
        let unit = 'Hz';

        if (compact) {
            if (frequency >= 1000) {
                unit = 'k' + unit;
                frequency = frequency / 1000;
            }
        }

        return this._l10n.format(
            'frequency.format',
            frequency,
            this._l10n.get(`frequency.unit.${unit}`),
        );
    };

    private _formatFrequency(frequencyAndEquivalent: number[]) {
        return this._l10n.format(
            'frequency.text',
            ...frequencyAndEquivalent.map((frequency, i) =>
                this._formatFrequencyUnit(frequency, !!i),
            ),
        );
    }
    /* tslint:enable:no-magic-numbers */

    private _checkMenu(mnu: HTMLButtonElement, chk: boolean) {
        function inner(element: HTMLElement, toggle: boolean) {
            if (element) {
                element.style.visibility = toggle ? 'visible' : 'hidden';
                element.setAttribute('aria-checked', toggle.toString());
            }
        }

        if (chk && mnu.dataset['radioGroup']) {
            this._mnu
                .querySelectorAll(
                    `[data-radio-group="${mnu.dataset['radioGroup']}"]`,
                )
                .forEach(element => {
                    inner(element.firstChild as HTMLElement, false);
                });
        }

        inner(mnu.firstChild as HTMLElement, chk);
    }

    private _drawCurve() {
        /* tslint:disable:no-magic-numbers */
        // all the 0.5's here are because of this explanation:
        // http://stackoverflow.com/questions/195262/can-i-turn-off-antialiasing-on-an-html-canvas-element
        // "Draw your 1-pixel lines on coordinates like ctx.lineTo(10.5, 10.5). Drawing a one-pixel line
        // over the point (10, 10) means, that this 1 pixel at that position reaches from 9.5 to 10.5 which
        // results in two lines that get drawn on the canvas.
        const middleOffset = 0.5;

        function pixelRound(x: number) {
            return Math.round(x) + middleOffset;
        }

        const context = this._context;
        const canvas = this._canvas;
        const pixelRatio = devicePixelRatio();
        const width = canvas.width / pixelRatio;
        const height = canvas.height / pixelRatio;
        const widthRatio = this._widthRatio();
        const heightRatio = this._heightRatio();
        const widthMinus1 = this._filter.options.visibleBinCount - 1;
        let curve = this._filter.channelCurves[this._currentChannelIndex];

        if (!context) {
            return false;
        }

        context.fillStyle = '#303030';
        context.fillRect(0, 0, width, height);
        context.lineWidth = 1;
        context.strokeStyle = '#5a5a5a';
        context.beginPath();
        let x = width + 1 + middleOffset;
        let y = pixelRound(this._filter.zeroChannelValueY * heightRatio);
        context.moveTo(x, y);

        while (x > 0) {
            context.lineTo(x - 4, y);
            x -= 10;
            context.moveTo(x, y);
        }

        context.stroke();
        context.font = 'bold 10pt Verdana';
        context.textAlign = this._isRTL ? 'left' : 'right';
        context.fillStyle = '#5a5a5a';
        context.fillText(
            '\u200E−0dB',
            this._isRTL ? 1 : width - 1,
            Math.round(this._filter.zeroChannelValueY * heightRatio) - 2,
        );
        context.beginPath();
        x = width - 1 - middleOffset;
        y = pixelRound(this._filter.options.validYRangeHeight * heightRatio);
        context.moveTo(x, y);

        while (x > 0) {
            context.lineTo(x - 4, y);
            x -= 10;
            context.moveTo(x, y);
        }

        context.stroke();
        context.fillText(
            '\u200E−∞dB',
            this._isRTL ? 1 : width - 1,
            Math.round(this._filter.options.validYRangeHeight * heightRatio) -
                2,
        );

        if (this._showZones) {
            for (
                let i = this._filter.equivalentZonesFrequencyCount.length - 2;
                i > 0;
                i--
            ) {
                x = pixelRound(
                    this._filter.equivalentZonesFrequencyCount[i] * widthRatio,
                );
                y = 0;
                context.beginPath();
                context.moveTo(x, y);

                while (y < height) {
                    context.lineTo(x, y + 4);
                    y += 10;
                    context.moveTo(x, y);
                }

                context.stroke();
            }
        }

        context.strokeStyle =
            this._isActualChannelCurveNeeded && !this._drawingMode
                ? '#707070'
                : this._rangeImage;
        context.beginPath();
        context.moveTo(0.5, pixelRound(curve[0] * heightRatio));

        for (x = 1; x < widthMinus1; x++) {
            context.lineTo(
                pixelRound(x * widthRatio),
                pixelRound(curve[x] * heightRatio),
            );
        }

        // just to fill up the last pixel!
        context.lineTo(
            Math.round(x * widthRatio) + 1,
            pixelRound(curve[x] * heightRatio),
        );
        context.stroke();

        if (this._isActualChannelCurveNeeded && !this._drawingMode) {
            curve = this._filter.actualChannelCurve;
            context.strokeStyle = this._rangeImage;
            context.beginPath();
            context.moveTo(middleOffset, pixelRound(curve[0] * heightRatio));

            for (x = 1; x < widthMinus1; x++) {
                context.lineTo(
                    pixelRound(x * widthRatio),
                    pixelRound(curve[x] * heightRatio),
                );
            }

            // just to fill up the last pixel!
            context.lineTo(
                Math.round(x * widthRatio) + 1,
                pixelRound(curve[x] * heightRatio),
            );
            context.stroke();
        }

        return true;
        /* tslint:enable:no-magic-numbers */
    }

    private _widthRatio() {
        return (
            this._canvas.width /
            devicePixelRatio() /
            this._filter.options.visibleBinCount
        );
    }

    private _heightRatio() {
        const height = this._stb.clientHeight;
        // tslint:disable-next-line:no-magic-numbers
        return (
            (this._canvas.height / devicePixelRatio() - height - 5) /
            this._filter.options.validYRangeHeight
        );
    }

    private _fixCanvasSize() {
        this._canvas.style.display = 'none';
        const rect = this._element.getBoundingClientRect();
        const pixelRatio = devicePixelRatio();
        this._canvas.style.display = '';
        this._canvas.style.width = rect.width + 'px';
        this._canvas.style.height = rect.height + 'px';
        this._canvas.width = rect.width * pixelRatio;
        this._canvas.height = rect.height * pixelRatio;

        this._context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        /* tslint:disable:no-magic-numbers */
        this._rangeImage = this._context.createLinearGradient(
            0,
            0,
            0,
            rect.height - this._stb.clientHeight - 5,
        );
        this._rangeImage.addColorStop(0, '#ff0000');
        this._rangeImage.addColorStop(0.1875, '#ffff00');
        this._rangeImage.addColorStop(0.39453125, '#00ff00');
        this._rangeImage.addColorStop(0.60546875, '#00ffff');
        this._rangeImage.addColorStop(0.796875, '#0000ff');
        this._rangeImage.addColorStop(1, '#ff00ff');
        /* tslint:enable:no-magic-numbers */

        this._drawCurve();
    }

    private _wrappedUpdateFilter = () => {
        this._filter.updateFilter(false);
    };

    private _setLabelParam(label: HTMLElement, text: string) {
        const span = label.querySelector('span');

        if (span) {
            span.textContent = text;
        }
    }

    private _setStatusBar(x: number, y: number, curveY: number) {
        this._setLabelParam(
            this._lblCursor,
            this._formatDB(this._filter.yToDB(y)),
        );
        this._setLabelParam(
            this._lblCurve,
            this._formatDB(this._filter.yToDB(curveY)),
        );
        this._setLabelParam(
            this._lblFrequency,
            this._formatFrequency(this._filter.visibleBinToFrequencyGroup(x)),
        );
    }

    private _toggleMenu(toggle?: boolean) {
        toggle =
            toggle === undefined ? this._mnu.style.display === 'none' : toggle;

        this._mnu.style.display = toggle ? '' : 'none';
        this._btnMnu.textContent = toggle ? '▼' : '▲';
    }

    // events

    private _btnMnuClick = (event: MouseEvent) => {
        if (!event.button) {
            this._toggleMenu();
        }
    };

    private _mnuChBLClick = (event: MouseEvent) => {
        this._mnuChBClick(event, 0);
    };

    private _mnuChBRClick = (event: MouseEvent) => {
        this._mnuChBClick(event, 1);
    };

    private _mnuChBClick = (event: MouseEvent, channelIndex: number) => {
        if (!event.button) {
            if (
                !this._isSameFilterLR ||
                this._currentChannelIndex !== channelIndex
            ) {
                if (this._isSameFilterLR) {
                    this._currentChannelIndex = channelIndex;
                    this._filter.channelIndex = -1;
                    this._filter.updateFilter(true);

                    if (this._isActualChannelCurveNeeded) {
                        this._filter.updateActualChannelCurve(channelIndex);
                    }

                    this._drawCurve();
                } else {
                    this._isSameFilterLR = true;
                    this._filter.copyFilter(channelIndex, 1 - channelIndex);
                    if (this._currentChannelIndex !== channelIndex) {
                        this._currentChannelIndex = channelIndex;

                        if (this._isActualChannelCurveNeeded) {
                            this._filter.updateActualChannelCurve(channelIndex);
                        }

                        this._drawCurve();
                    }
                }

                this._checkMenu(this._mnuChBL, channelIndex === 0);
                this._checkMenu(this._mnuChBR, channelIndex === 1);
            }
        }
    };

    private _mnuChLClick = (event: MouseEvent) => {
        this._mnuChLRClick(event, 0);
    };

    private _mnuChRClick = (event: MouseEvent) => {
        this._mnuChLRClick(event, 1);
    };

    private _mnuChLRClick = (event: MouseEvent, channelIndex: number) => {
        if (!event.button) {
            if (
                this._isSameFilterLR ||
                this._currentChannelIndex !== channelIndex
            ) {
                if (this._isSameFilterLR) {
                    this._isSameFilterLR = false;
                    this._filter.channelIndex = 1 - this._currentChannelIndex;
                    this._filter.updateFilter(false);
                }

                if (this._currentChannelIndex !== channelIndex) {
                    this._currentChannelIndex = channelIndex;

                    if (this._isActualChannelCurveNeeded) {
                        this._filter.updateActualChannelCurve(channelIndex);
                    }

                    this._drawCurve();
                }

                this._checkMenu(this._mnuChL, channelIndex === 0);
                this._checkMenu(this._mnuChR, channelIndex === 1);
            }
        }
    };

    private _mnuShowZonesClick = (event: MouseEvent) => {
        if (!event.button) {
            this._showZones = !this._showZones;
            this._checkMenu(this._mnuShowZones, this._showZones);
            this._drawCurve();
        }
    };

    private _mnuEditZonesClick = (event: MouseEvent) => {
        if (!event.button) {
            this._editZones = !this._editZones;
            this._canvas.classList[this._editZones ? 'add' : 'remove'](
                `${this._options.classNamespace}CNVZON`,
            );
            this._checkMenu(this._mnuEditZones, this._editZones);
        }
    };

    private _mnuNormalizeCurvesClick = (event: MouseEvent) => {
        if (!event.button) {
            this._filter.isNormalized = !this._filter.isNormalized;
            this._checkMenu(
                this._mnuNormalizeCurves,
                this._filter.isNormalized,
            );

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(
                    this._currentChannelIndex,
                );
                this._drawCurve();
            }
        }
    };

    private _mnuShowActualClick = (event: MouseEvent) => {
        if (!event.button) {
            this._isActualChannelCurveNeeded = !this
                ._isActualChannelCurveNeeded;
            this._checkMenu(
                this._mnuShowActual,
                this._isActualChannelCurveNeeded,
            );

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(
                    this._currentChannelIndex,
                );
            }

            this._drawCurve();
        }
    };

    private _btnMnuKeyDown = (event: KeyboardEvent) => {
        if (keyPressed(event, 'ArrowUp', 'ArrowDown')) {
            cancelEvent(event);
            this._toggleMenu(keyPressed(event, 'ArrowUp'));

            window.setTimeout(() => {
                const items = this._mnu.querySelectorAll(
                    `.${this._options.classNamespace}MNUIT`,
                );
                (items[items.length - 1] as HTMLButtonElement).focus();
            });
        }
    };

    private _mnuKeyDown = (event: KeyboardEvent) => {
        const moveFocus = (down: boolean) => {
            const element = event.target as Node;
            const siblingProperty = down ? 'nextSibling' : 'previousSibling';
            let currentElement: Node | null = element;

            do {
                currentElement = currentElement[siblingProperty];

                if (
                    currentElement instanceof HTMLButtonElement &&
                    currentElement.classList.contains(
                        `${this._options.classNamespace}MNUIT`,
                    )
                ) {
                    currentElement.focus();
                    return true;
                }
            } while (currentElement);

            return false;
        };

        if (keyPressed(event, 'ArrowUp', 'ArrowDown')) {
            cancelEvent(event);
            const down = keyPressed(event, 'ArrowDown');
            if (!moveFocus(down) && down) {
                this._btnMnu.focus();
            }
        }
    };

    private _canvasMouseDown = (event: MouseEvent) => {
        if (!event.button) {
            if (!this._drawingMode) {
                const { x, y } = elementCoordinates(this._canvas, event);

                const normX = Math.floor(x / this._widthRatio());
                const normY = y / this._heightRatio();

                if (
                    normX >= 0 &&
                    normX < this._filter.options.visibleBinCount
                ) {
                    this._drawingMode = 1;
                    if (this._editZones) {
                        this._filter.changeZoneY(
                            this._currentChannelIndex,
                            normX,
                            normY,
                        );
                    } else {
                        this._filter.channelCurves[this._currentChannelIndex][
                            normX
                        ] = this._filter.clampY(normY);
                        this._lastDrawX = normX;
                        this._lastDrawY = normY;
                    }

                    this._drawCurve();

                    if (this._canvas.setPointerCapture) {
                        this._canvas.setPointerCapture(
                            (event as PointerEvent).pointerId,
                        );
                    } else if (!(event as any).clonedFromTouch) {
                        detachPointer(
                            this._canvas,
                            'move',
                            this._canvasMouseMove,
                        );
                        detachPointer(this._canvas, 'up', this._canvasMouseUp);
                        attachPointer(
                            document,
                            'move',
                            this._documentMouseMove,
                            true,
                        );
                        attachPointer(
                            document,
                            'up',
                            this._documentMouseUp,
                            true,
                        );
                    }
                }
            }

            return cancelEvent(event);
        }

        return true;
    };

    private _canvasMouseUp = (event: MouseEvent) => {
        if (this._drawingMode) {
            this._drawingMode = 0;
            this._filter.channelIndex = this._currentChannelIndex;
            this._filter.updateFilter(false);

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(
                    this._currentChannelIndex,
                );
            }

            this._drawCurve();

            if (this._canvas.releasePointerCapture) {
                this._canvas.releasePointerCapture(
                    (event as PointerEvent).pointerId,
                );
            } else if (!(event as any).clonedFromTouch) {
                detachPointer(document, 'move', this._documentMouseMove, true);
                detachPointer(document, 'up', this._documentMouseUp, true);
                attachPointer(this._canvas, 'move', this._canvasMouseMove);
                attachPointer(this._canvas, 'up', this._canvasMouseUp);
            }
        }
    };

    private _canvasMouseMove = (event: MouseEvent) => {
        let curve = this._filter.channelCurves[this._currentChannelIndex];
        const { x, y } = elementCoordinates(this._canvas, event);

        if (
            this._drawingMode ||
            (x >= 0 &&
                x < this._canvas.width &&
                y >= 0 &&
                y < this._canvas.height)
        ) {
            let normX = Math.floor(x / this._widthRatio());
            let normY = y / this._heightRatio();

            if (normX < 0) {
                normX = 0;
            } else if (normX >= this._filter.options.visibleBinCount) {
                normX = this._filter.options.visibleBinCount - 1;
            }

            if (this._drawingMode) {
                if (this._editZones) {
                    this._filter.changeZoneY(
                        this._currentChannelIndex,
                        normX,
                        normY,
                    );
                } else {
                    if (Math.abs(normX - this._lastDrawX) > 1) {
                        const delta =
                            (normY - this._lastDrawY) /
                            Math.abs(normX - this._lastDrawX);
                        const inc = normX < this._lastDrawX ? -1 : 1;
                        normY = this._lastDrawY + delta;
                        let count = Math.abs(normX - this._lastDrawX) - 1;

                        for (
                            normX = this._lastDrawX + inc;
                            count > 0;
                            normX += inc, count--
                        ) {
                            curve[normX] = this._filter.clampY(normY);
                            normY += delta;
                        }
                    }

                    curve[normX] = this._filter.clampY(normY);
                    this._lastDrawX = normX;
                    this._lastDrawY = normY;
                }
                this._drawCurve();

                if (this._options.updateFilterOnDrag) {
                    // tslint:disable-next-line:no-magic-numbers
                    throttledFunction(this._wrappedUpdateFilter, 150);
                }
            } else if (this._isActualChannelCurveNeeded) {
                curve = this._filter.actualChannelCurve;
            }

            this._setStatusBar(normX, normY, curve[normX]);

            if (this._drawingMode) {
                return cancelEvent(event);
            }
        }

        return true;
    };

    private _windowResize = () => {
        this._fixCanvasSize();
    };

    private _documentMouseMove = (event: MouseEvent) =>
        this._canvasMouseMove(event);

    private _documentMouseUp = (event: MouseEvent) => {
        this._canvasMouseUp(event);
    };

    // virtual properties

    get options() {
        return deepAssign(
            {} as Required<CanvasEqualizerOptions>,
            defaultOptions,
            this._options,
        );
    }

    get filterLength() {
        return this._filter.filterLength;
    }

    set filterLength(newFilterLength: number) {
        if (this._filter.filterLength !== newFilterLength) {
            this._filter.filterLength = newFilterLength;

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(
                    this._currentChannelIndex,
                );
            }

            this._drawCurve();
        }
    }

    get sampleRate() {
        return this._filter.sampleRate;
    }

    set sampleRate(newSampleRate: number) {
        if (this._filter.sampleRate !== newSampleRate) {
            this._filter.sampleRate = newSampleRate;

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(
                    this._currentChannelIndex,
                );
            }

            this._drawCurve();
        }
    }

    get audioContext() {
        return this._filter.audioContext;
    }

    set audioContext(newAudioContext: AudioContext) {
        if (this._filter.audioContext !== newAudioContext) {
            this._filter.audioContext = newAudioContext;
        }
    }

    get language() {
        return this._l10n.language;
    }

    set language(language: string) {
        this._l10n.language = language;
    }

    get visibleFrequencies() {
        return this._filter.visibleFrequencies;
    }

    get convolver() {
        return this._filter.convolver;
    }
}
