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

import deepAssign from 'deep-assign';

import {
    keyPressed,
    elemCoords,
    attachPointer, detachPointer, cancelEvent,
    throttledFunction, addThrottledEvent, removeThrottledEvent,
} from './Common';

import Equalizer from './Equalizer';
import L10n from './L10n';

import ICanvasEqualizerOptions from './ICanvasEqualizerOptions';
import ILocale from './ILocale';

const defaultOptions: ICanvasEqualizerOptions = {
    classNamespace: 'GE',
    filterOptions: {},
    updateFilterOnDrag: true,
};

export default class CanvasEqualizer {

    private _options: ICanvasEqualizerOptions;
    private _filter: Equalizer;
    private _element: HTMLElement;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
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

    constructor(filterLength: number, audioContext: AudioContext, options: ICanvasEqualizerOptions = {}) {
        this._options = deepAssign({}, defaultOptions, options);
        this._filter = new Equalizer(filterLength, audioContext, this._options.filterOptions);
        this._l10n = new L10n(this._options.language);
    }

    public createControl(placeholder: HTMLElement): HTMLCanvasElement {
        if (!this._ctx) {
            const createLabel = (name: string, content: string) => {
                const lbl = document.createElement('div');
                lbl.className = `${clsNS}LBL ${clsNS}LBL${name}`;
                lbl.innerHTML = this._l10n.get(content);
                return lbl;
            };
            const createMenuSep = () => {
                const s = document.createElement('div');
                s.className = `${clsNS}MNUSEP`;
                s.setAttribute('role', 'separator');
                return s;
            };
            const createMenuLabel = (text: string) => {
                const l = document.createElement('div');
                l.className = `${clsNS}MNULBL`;
                l.textContent = this._l10n.get(text);
                return l;
            };
            const createMenuItem = (text: string, checkable: boolean | string, checked: boolean,
                                    clickHandler: (e?: MouseEvent) => any) => {
                const i = document.createElement('button');
                i.type = 'button';
                i.className = `${clsNS}MNUIT ${clsNS}CLK`;

                if (checkable) {
                    if (typeof checkable === 'string') {
                        i.dataset['radioGroup'] = checkable;
                        i.setAttribute('role', 'menuitemradio');
                    }
                    else {
                        i.setAttribute('role', 'menuitemcheckbox');
                    }

                    const s = document.createElement('span');
                    s.textContent = typeof checkable === 'string' ? '● ' : '■ ';
                    i.appendChild(s);
                    this._checkMenu(i, checked);
                }
                else {
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
            const clsNS = this._options.classNamespace!;

            this._element = placeholder;
            placeholder.className = clsNS;

            if (/\bip(?:[ao]d|hone)\b/i.test(navigator.userAgent) && !(window as any).MSStream) {
                placeholder.classList.add(`${clsNS}IOS`);
            }

            if (getComputedStyle(placeholder).direction === 'rtl') {
                placeholder.classList.add('RTL');
                this._isRTL = true;
            }

            placeholder.addEventListener('contextmenu', cancelEvent);

            this._stb = document.createElement('div');
            this._stb.className = `${clsNS}STB`;
            placeholder.appendChild(this._stb);

            this._canvas = document.createElement('canvas');
            this._canvas.className = `${clsNS}CNV`;
            attachPointer(this._canvas, 'down', this._canvasMouseDown);
            attachPointer(this._canvas, 'move', this._canvasMouseMove);
            attachPointer(this._canvas, 'up', this._canvasMouseUp);
            this._canvas.addEventListener('contextmenu', cancelEvent);
            placeholder.appendChild(this._canvas);
            addThrottledEvent(window, 'resize', this._windowResize);

            const ctx = this._canvas.getContext('2d');

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
            this._btnMnu.className = `${clsNS}BTN ${clsNS}CLK`;
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
            this._mnu.className = `${clsNS}MNU`;
            this._mnu.setAttribute('role', 'menu');
            this._mnu.addEventListener('keydown', this._mnuKeyDown);
            this._mnu.appendChild(createMenuLabel('menu.both'));
            this._mnu.appendChild(this._mnuChBL =
                createMenuItem('menu.both.left', 'curve', true, this._mnuChBLClick));
            this._mnu.appendChild(this._mnuChBR =
                createMenuItem('menu.both.right', 'curve', false, this._mnuChBRClick));
            this._mnu.appendChild(createMenuSep());
            this._mnu.appendChild(createMenuLabel('menu.one'));
            this._mnu.appendChild(this._mnuChL =
                createMenuItem('menu.one.left', 'curve', false, this._mnuChLClick));
            this._mnu.appendChild(this._mnuChR =
                createMenuItem('menu.one.right', 'curve', false, this._mnuChRClick));
            this._mnu.appendChild(createMenuSep());
            this._mnu.appendChild(this._mnuShowZones =
                createMenuItem('menu.zones', true, false, this._mnuShowZonesClick));
            this._mnu.appendChild(this._mnuEditZones =
                createMenuItem('menu.zoneEdit', true, false, this._mnuEditZonesClick));
            this._mnu.appendChild(createMenuSep());
            this._mnu.appendChild(this._mnuNormalizeCurves =
                createMenuItem('menu.normalizeCurves', true, false, this._mnuNormalizeCurvesClick));
            this._mnu.appendChild(this._mnuShowActual =
                createMenuItem('menu.actualResponse', true, true, this._mnuShowActualClick));
            this._stb.appendChild(this._mnu);
            this._toggleMenu(false);

            this._fixCanvasSize();
            this._drawCurve();
        }
        return this._canvas;
    }

    public destroyControl() {
        if (this._ctx) {
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
            delete this._ctx;
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

    public loadLocale(language: string, locale: ILocale) {
        this._l10n.loadLocale(language, locale);
    }

    /* tslint:disable:no-magic-numbers */
    private _formatDB(dB: number): string {
        if (dB < -40) {
            dB = -Infinity;
        }

        const ret = dB.toLocaleString(this._l10n.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return dB < 0 ? ret.replace('-', '−') : (dB === 0 ? '−' + ret : '+' + ret);
    }

    private _formatFrequencyUnit = (frequency: number, compact: boolean): string => {
        let unit = 'Hz';

        if (compact) {
            if (frequency >= 1000) {
                unit = 'k' + unit;
                frequency = frequency / 1000;
            }
        }

        return this._l10n.format('frequency.format', frequency, this._l10n.get(`frequency.unit.${unit}`));
    }

    private _formatFrequency(frequencyAndEquivalent: number[]): string {
        return this._l10n.format('frequency.text',
            ...frequencyAndEquivalent.map((frequency: number, i: number) => this._formatFrequencyUnit(frequency, !!i)));
    }
    /* tslint:enable:no-magic-numbers */

    private _checkMenu(mnu: HTMLButtonElement, chk: boolean) {

        function inner(elem: HTMLElement, toggle: boolean) {
            if (elem) {
                elem.style.visibility = toggle ? 'visible' : 'hidden';
                elem.setAttribute('aria-checked', toggle.toString());
            }
        }

        if (chk && mnu.dataset['radioGroup']) {
            [].slice.call(this._mnu.querySelectorAll(`[data-radio-group="${mnu.dataset['radioGroup']}"]`))
                .forEach((elem: HTMLButtonElement) => {
                    inner(elem.firstChild as HTMLElement, false);
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
        function pixelRound(x: number): number {
            return Math.round(x) + middleOffset;
        }

        const ctx = this._ctx;
        const canvas = this._canvas;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.width / pixelRatio;
        const height = canvas.height / pixelRatio;
        const widthRatio = this._widthRatio();
        const heightRatio = this._heightRatio();
        const widthMinus1 = this._filter.options.visibleBinCount! - 1;
        const middleOffset = 0.5;
        let curve = this._filter.channelCurves[this._currentChannelIndex];

        if (!ctx) {
            return false;
        }

        ctx.fillStyle = '#303030';
        ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#5a5a5a';
        ctx.beginPath();
        let x = width + 1 + middleOffset;
        let y = pixelRound(this._filter.zeroChannelValueY * heightRatio);
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
        ctx.fillText('\u200e−0dB', this._isRTL ? 1 : width - 1,
            Math.round(this._filter.zeroChannelValueY * heightRatio) - 2);
        ctx.beginPath();
        x = width - 1 - middleOffset;
        y = pixelRound(this._filter.options.validYRangeHeight! * heightRatio);
        ctx.moveTo(x, y);

        while (x > 0) {
            ctx.lineTo(x - 4, y);
            x -= 10;
            ctx.moveTo(x, y);
        }

        ctx.stroke();
        ctx.fillText('\u200e−∞dB', this._isRTL ? 1 : width - 1,
            Math.round(this._filter.options.validYRangeHeight! * heightRatio) - 2);

        if (this._showZones) {
            for (let i = this._filter.equivalentZonesFrequencyCount.length - 2; i > 0; i--) {
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
                ctx.lineTo(pixelRound(x * widthRatio),
                    pixelRound(curve[x] * heightRatio));
            }

            // just to fill up the last pixel!
            ctx.lineTo(Math.round(x * widthRatio) + 1, pixelRound(curve[x] * heightRatio));
            ctx.stroke();
        }

        return true;
        /* tslint:enable:no-magic-numbers */
    }

    private _widthRatio(): number {
        return this._canvas.width / window.devicePixelRatio / this._filter.options.visibleBinCount!;
    }

    private _heightRatio(): number {
        const height = this._stb.clientHeight;
        // tslint:disable-next-line:no-magic-numbers
        return (this._canvas.height / window.devicePixelRatio - height - 5) / this._filter.options.validYRangeHeight!;
    }

    private _fixCanvasSize() {
        this._canvas.style.display = 'none';
        const rect = this._element.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio;
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

    private _wrappedUpdateFilter = () => {
        this._filter.updateFilter(false);
    }

    private _setLabelParam(label: HTMLElement, text: string) {
        const span = label.querySelector('span');

        if (span) {
            span.textContent = text;
        }
    }

    private _setStatusBar(x: number, y: number, curveY: number) {
        this._setLabelParam(this._lblCursor, this._formatDB(this._filter.yToDB(y)));
        this._setLabelParam(this._lblCurve, this._formatDB(this._filter.yToDB(curveY)));
        this._setLabelParam(this._lblFrequency, this._formatFrequency(this._filter.visibleBinToFrequencyGroup(x)));
    }

    private _toggleMenu(toggle?: boolean) {
        toggle = toggle === undefined ? this._mnu.style.display === 'none' : toggle;

        this._mnu.style.display = toggle ? '' : 'none';
        this._btnMnu.textContent = toggle ? '▼' : '▲';
    }

    // events

    private _btnMnuClick = (e: MouseEvent) => {
        if (!e.button) {
            this._toggleMenu();
        }
    }

    private _mnuChBLClick = (e: MouseEvent) => {
        this._mnuChBClick(e, 0);
    }

    private _mnuChBRClick = (e: MouseEvent) => {
        this._mnuChBClick(e, 1);
    }

    private _mnuChBClick = (e: MouseEvent, channelIndex: number) => {
        if (!e.button) {
            if (!this._isSameFilterLR || this._currentChannelIndex !== channelIndex) {
                if (this._isSameFilterLR) {
                    this._currentChannelIndex = channelIndex;
                    this._filter.channelIndex = -1;
                    this._filter.updateFilter(true);

                    if (this._isActualChannelCurveNeeded) {
                        this._filter.updateActualChannelCurve(channelIndex);
                    }

                    this._drawCurve();
                }
                else {
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
    }

    private _mnuChLClick = (e: MouseEvent) => {
        this._mnuChLRClick(e, 0);
    }

    private _mnuChRClick = (e: MouseEvent) => {
        this._mnuChLRClick(e, 1);
    }

    private _mnuChLRClick = (e: MouseEvent, channelIndex: number) => {
        if (!e.button) {
            if (this._isSameFilterLR || this._currentChannelIndex !== channelIndex) {
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
    }

    private _mnuShowZonesClick = (e: MouseEvent) => {
        if (!e.button) {
            this._showZones = !this._showZones;
            this._checkMenu(this._mnuShowZones, this._showZones);
            this._drawCurve();
        }
    }

    private _mnuEditZonesClick = (e: MouseEvent) => {
        if (!e.button) {
            this._editZones = !this._editZones;
            this._canvas.classList[this._editZones ? 'add' : 'remove'](`${this._options.classNamespace}CNVZON`);
            this._checkMenu(this._mnuEditZones, this._editZones);
        }
    }

    private _mnuNormalizeCurvesClick = (e: MouseEvent) => {
        if (!e.button) {
            this._filter.isNormalized = !this._filter.isNormalized;
            this._checkMenu(this._mnuNormalizeCurves, this._filter.isNormalized);

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(this._currentChannelIndex);
                this._drawCurve();
            }
        }
    }

    private _mnuShowActualClick = (e: MouseEvent) => {
        if (!e.button) {
            this._isActualChannelCurveNeeded = !this._isActualChannelCurveNeeded;
            this._checkMenu(this._mnuShowActual, this._isActualChannelCurveNeeded);

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(this._currentChannelIndex);
            }

            this._drawCurve();
        }
    }

    private _btnMnuKeyDown = (e: KeyboardEvent) => {
        if (keyPressed(e, 'ArrowUp', 'ArrowDown')) {
            cancelEvent(e);
            this._toggleMenu(keyPressed(e, 'ArrowUp'));

            window.setTimeout(() => {
                const items = this._mnu.querySelectorAll(`.${this._options.classNamespace!}MNUIT`);
                (items[items.length - 1] as HTMLButtonElement).focus();
            });
        }
    }

    private _mnuKeyDown = (e: KeyboardEvent) => {

        const moveFocus = (elem: Node, down: boolean) => {
            const siblingProp = down ? 'nextSibling' : 'previousSibling';
            let currentElem: Node | null = elem;

            do {
                currentElem = currentElem[siblingProp];

                if (currentElem instanceof HTMLButtonElement &&
                    currentElem.classList.contains(`${this._options.classNamespace!}MNUIT`)) {
                    currentElem.focus();
                    return true;
                }
            } while (currentElem);

            return false;
        };

        if (keyPressed(e, 'ArrowUp', 'ArrowDown')) {
            cancelEvent(e);
            const down = keyPressed(e, 'ArrowDown');
            if (!moveFocus(e.target as Node, down) && down) {
                this._btnMnu.focus();
            }
        }
    }

    private _canvasMouseDown = (e: MouseEvent) => {
        if (!e.button) {
            if (!this._drawingMode) {
                const { x, y } = elemCoords(this._canvas, e);

                const normX = Math.floor(x / this._widthRatio());
                const normY = y / this._heightRatio();

                if (normX >= 0 && normX < this._filter.options.visibleBinCount!) {
                    this._drawingMode = 1;
                    if (this._editZones) {
                        this._filter.changeZoneY(this._currentChannelIndex, normX, normY);
                    }
                    else {
                        this._filter.channelCurves[this._currentChannelIndex][normX] = this._filter.clampY(normY);
                        this._lastDrawX = normX;
                        this._lastDrawY = normY;
                    }

                    this._drawCurve();

                    if (this._canvas.setPointerCapture) {
                        this._canvas.setPointerCapture((e as PointerEvent).pointerId);
                    }
                    else if (!(e as any).clonedFromTouch) {
                        detachPointer(this._canvas, 'move', this._canvasMouseMove);
                        detachPointer(this._canvas, 'up', this._canvasMouseUp);
                        attachPointer(document, 'move', this._documentMouseMove, true);
                        attachPointer(document, 'up', this._documentMouseUp, true);
                    }
                }
            }

            return cancelEvent(e);
        }

        return true;
    }

    private _canvasMouseUp = (e: MouseEvent) => {
        if (this._drawingMode) {
            this._drawingMode = 0;
            this._filter.channelIndex = this._currentChannelIndex;
            this._filter.updateFilter(false);

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(this._currentChannelIndex);
            }

            this._drawCurve();

            if (this._canvas.releasePointerCapture) {
                this._canvas.releasePointerCapture((e as PointerEvent).pointerId);
            }
            else if (!(e as any).clonedFromTouch) {
                detachPointer(document, 'move', this._documentMouseMove, true);
                detachPointer(document, 'up', this._documentMouseUp, true);
                attachPointer(this._canvas, 'move', this._canvasMouseMove);
                attachPointer(this._canvas, 'up', this._canvasMouseUp);
            }
        }
    }

    private _canvasMouseMove = (e: MouseEvent) => {
        let curve = this._filter.channelCurves[this._currentChannelIndex];
        const { x, y } = elemCoords(this._canvas, e);

        if (this._drawingMode || (x >= 0 && x < this._canvas.width && y >= 0 && y < this._canvas.height)) {
            let normX = Math.floor(x / this._widthRatio());
            let normY = y / this._heightRatio();

            if (normX < 0) {
                normX = 0;
            }
            else if (normX >= this._filter.options.visibleBinCount!) {
                normX = this._filter.options.visibleBinCount! - 1;
            }

            if (this._drawingMode) {
                if (this._editZones) {
                    this._filter.changeZoneY(this._currentChannelIndex, normX, normY);
                }
                else {
                    if (Math.abs(normX - this._lastDrawX) > 1) {
                        const delta = (normY - this._lastDrawY) / Math.abs(normX - this._lastDrawX);
                        const inc = ((normX < this._lastDrawX) ? -1 : 1);
                        normY = this._lastDrawY + delta;
                        let count = Math.abs(normX - this._lastDrawX) - 1;

                        for (normX = this._lastDrawX + inc; count > 0; normX += inc, count--) {
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
            }
            else if (this._isActualChannelCurveNeeded) {
                curve = this._filter.actualChannelCurve;
            }

            this._setStatusBar(normX, normY, curve[normX]);

            if (this._drawingMode) {
                return cancelEvent(e);
            }
        }

        return true;
    }

    private _windowResize = () => {
        this._fixCanvasSize();
    }

    private _documentMouseMove = (e: MouseEvent) =>
        this._canvasMouseMove(e);

    private _documentMouseUp = (e: MouseEvent) => {
        this._canvasMouseUp(e);
    }

    // virtual properties

    get options(): ICanvasEqualizerOptions {
        return deepAssign({}, defaultOptions, this._options);
    }

    get filterLength(): number {
        return this._filter.filterLength;
    }

    set filterLength(newFilterLength: number) {
        if (this._filter.filterLength !== newFilterLength) {
            this._filter.filterLength = newFilterLength;

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(this._currentChannelIndex);
            }

            this._drawCurve();
        }
    }

    get sampleRate(): number {
        return this._filter.sampleRate;
    }

    set sampleRate(newSampleRate: number) {
        if (this._filter.sampleRate !== newSampleRate) {
            this._filter.sampleRate = newSampleRate;

            if (this._isActualChannelCurveNeeded) {
                this._filter.updateActualChannelCurve(this._currentChannelIndex);
            }

            this._drawCurve();
        }
    }

    get audioContext(): AudioContext {
        return this._filter.audioContext;
    }

    set audioContext(newAudioContext: AudioContext) {
        if (this._filter.audioContext !== newAudioContext) {
            this._filter.audioContext = newAudioContext;
        }
    }

    get language(): string {
        return this._l10n.language;
    }

    set language(language: string) {
        this._l10n.language = language;
    }

    get visibleFrequencies(): Float32Array {
        return this._filter.visibleFrequencies;
    }

    get convolver(): ConvolverNode {
        return this._filter.convolver;
    }
}
