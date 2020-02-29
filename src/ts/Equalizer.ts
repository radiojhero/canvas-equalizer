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
 * https://github.com/radiojhero/canvas-equalizer
 */

/* tslint:disable:no-magic-numbers no-bitwise */

import deepAssign from 'deep-assign';
import { FFTReal } from './FFTNR';
import IEqualizerOptions, { ConvolverCallback } from './IEqualizerOptions';

const defaultOptions: IEqualizerOptions = {
    validYRangeHeight: 255,
    visibleBinCount: 512,
};

export default class Equalizer {

    private _options: IEqualizerOptions;
    private _visibleFrequencies: Float32Array;
    private _equivalentZones: Uint16Array;
    private _equivalentZonesFrequencyCount: Float32Array;
    private _zeroChannelValueY: number;
    private _maximumChannelValue: number;
    private _minimumChannelValue: number;
    private _minusInfiniteChannelValue: number;
    private _maximumChannelValueY: number;
    private _minimumChannelValueY: number;
    private _filterLength: number;
    private _sampleRate: number;
    private _isNormalized: boolean;
    private _binCount: number;
    private _audioContext: AudioContext;
    private _filterKernel: AudioBuffer;
    private _convolver: ConvolverNode;
    private _tmp: Float32Array;
    private _channelCurves: Int16Array[];
    private _actualChannelCurve: Int16Array;
    private _channelIndex: number;

    constructor(filterLength: number, audioContext: AudioContext, options: IEqualizerOptions = {}) {
        Equalizer._validateFilterLength(filterLength);

        this._options = deepAssign({}, defaultOptions, options);
        this._filterLength = filterLength;
        this._sampleRate = audioContext.sampleRate || 44100;
        this._isNormalized = false;
        this._binCount = (filterLength >>> 1) + 1;
        this._audioContext = audioContext;
        this._filterKernel = audioContext.createBuffer(2, filterLength, this._sampleRate);
        this._tmp = new Float32Array(filterLength);
        this._channelCurves = [
            new Int16Array(this._options.visibleBinCount!), new Int16Array(this._options.visibleBinCount!)];
        this._actualChannelCurve = new Int16Array(this._options.visibleBinCount!);
        this._channelIndex = -1;

        this._zeroChannelValueY = this._options.validYRangeHeight! >>> 1;
        this._maximumChannelValue = this._options.validYRangeHeight! >>> 1;
        this._minimumChannelValue = -(this._options.validYRangeHeight! >>> 1);
        this._minusInfiniteChannelValue = -(this._options.validYRangeHeight! >>> 1) - 1;
        this._maximumChannelValueY = 0;
        this._minimumChannelValueY = this._options.validYRangeHeight! - 1;

        this._visibleFrequencies = new Float32Array(this._options.visibleBinCount!);
        this._equivalentZones = new Uint16Array([31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]);

        /* [0, +9, +9, +18, +35, +36, +70, +72, +72, +72, visibleBinCount] */
        let eqz = [0, 9, 18, 36, 71, 107, 177, 249, 321, 393, 512];
        const ratio = this._options.visibleBinCount! / eqz[eqz.length - 1];
        let freqSteps = [5, 5, 5, 5, 10, 10, 20, 40, 80, 89];
        const firstFreqs = [5, 50, 95, 185, 360, 720, 1420, 2860, 5740, 11498];
        let f = firstFreqs[0];

        if (this._options.visibleBinCount! !== eqz[eqz.length - 1]) {
            eqz = eqz.map((num: number) => Math.round(num * ratio));
            freqSteps = freqSteps.map((num: number) => num / ratio);
        }

        this._equivalentZonesFrequencyCount = new Float32Array(eqz);

        for (let i = 0, s = 0; i < this._options.visibleBinCount!; i++) {
            this._visibleFrequencies[i] = f;
            if (s !== eqz.length - 1 && s !== firstFreqs.length - 1 && i + 1 >= eqz[s + 1]) {
                s++;
                f = firstFreqs[s];
            }
            else {
                f += freqSteps[s];
            }
        }

        this.reset();
        this._convolver = audioContext.createConvolver();
        this._convolver.normalize = false;
        this._convolver.buffer = this._filterKernel;
    }

    public reset() {
        for (let i = this._options.visibleBinCount! - 1; i >= 0; i--) {
            this._channelCurves[0][i] = this._zeroChannelValueY;
            this._channelCurves[1][i] = this._zeroChannelValueY;
            this._actualChannelCurve[i] = this._zeroChannelValueY;
        }

        this.updateFilter(true);
        this.updateActualChannelCurve(0);
    }

    public clampY(y: number): number {
        const maxY = this._maximumChannelValueY;
        const minY = this._minimumChannelValueY;

        return y <= maxY ? maxY : (y > minY ? this._options.validYRangeHeight! + 1 : y);
    }

    public yToDB(y: number): number {
        const maxY = this._maximumChannelValueY;
        const minY = this._minimumChannelValueY;

        return y <= maxY ? 40 : (y > minY ? -Infinity : Equalizer._lerp(maxY, 40, minY, -40, y));
    }

    public yToMagnitude(y: number): number {
        // 40dB = 100
        // -40dB = 0.01
        // magnitude = 10 ^ (dB/20)
        // log a (x^p) = p * log a (x)
        // x^p = a ^ (p * log a (x))
        // 10^p = e ^ (p * log e (10))
        const maxY = this._maximumChannelValueY;
        const minY = this._minimumChannelValueY;

        return y <= maxY ? 100 :
            (y > minY ? 0 : Math.exp(Equalizer._lerp(maxY, 2, minY, -2, y) * Math.LN10)); // 2 = 40dB/20
    }

    public magnitudeToY(magnitude: number): number {
        // 40dB = 100
        // -40dB = 0.01
        const zcy = this._zeroChannelValueY;

        return magnitude >= 100
               ? this._maximumChannelValueY
               : (magnitude < 0.01
                  ? this._options.validYRangeHeight! + 1
                  : Math.round((zcy - (zcy * Math.log(magnitude) / Math.LN10 * 0.5)) - 0.4));
    }

    public visibleBinToZoneIndex(visibleBinIndex: number): number {
        if (visibleBinIndex >= (this._options.visibleBinCount! - 1)) {
            return this._equivalentZones.length - 1;
        }
        else if (visibleBinIndex > 0) {
            const z = this._equivalentZonesFrequencyCount;

            for (let i = z.length - 1; i >= 0; i--) {
                if (visibleBinIndex >= z[i]) {
                    return i;
                }
            }
        }

        return 0;
    }

    public visibleBinToFrequency(visibleBinIndex: number): number {
        const vf = this._visibleFrequencies;
        const vbc = this._options.visibleBinCount!;

        if (visibleBinIndex >= vbc - 1) {
            return vf[vbc - 1];
        }
        else if (visibleBinIndex > 0) {
            return vf[visibleBinIndex];
        }

        return vf[0];
    }

    public visibleBinToFrequencyGroup(visibleBinIndex: number): number[] {
        const ez = this._equivalentZones;
        const vf = this._visibleFrequencies;
        const vbc = this._options.visibleBinCount!;

        if (visibleBinIndex >= vbc - 1) {
            return [Math.round(vf[vbc - 1]), Math.round(ez[ez.length - 1])];
        }
        else if (visibleBinIndex > 0) {
            const ezc = this._equivalentZonesFrequencyCount;

            for (let i = ezc.length - 1; i >= 0; i--) {
                if (visibleBinIndex >= ezc[i]) {
                    return [Math.round(vf[visibleBinIndex]), Math.round(ez[i])];
                }
            }
        }

        return [Math.round(vf[0]), Math.round(ez[0])];
    }

    public changeZoneY(channelIndex: number, x: number, y: number) {
        let i = this.visibleBinToZoneIndex(x);
        const ii = this._equivalentZonesFrequencyCount[i + 1];
        const cy = this.clampY(y);
        const curve = this._channelCurves[channelIndex];

        for (i = this._equivalentZonesFrequencyCount[i]; i < ii; i++) {
            curve[i] = cy;
        }
    }

    private _updateBuffer() {
        if (this._options.convolverCallback) {
            const oldConvolver = this._convolver;
            this._convolver = this.audioContext.createConvolver();
            this._convolver.normalize = false;
            this._convolver.buffer = this._filterKernel;
            this._options.convolverCallback(oldConvolver, this._convolver);
        } else {
            this._convolver.buffer = this._filterKernel;
        }
    }

    public copyFilter(sourceChannel: number, destinationChannel: number) {
        const src = this._filterKernel.getChannelData(sourceChannel);
        const dst = this._filterKernel.getChannelData(destinationChannel);

        for (let i = (this._filterLength - 1); i >= 0; i--) {
            dst[i] = src[i];
        }

        if (this._convolver) {
            this._updateBuffer();
        }
    }

    public updateFilter(updateBothChannels: boolean) {
        const channelIndex = Math.max(this._channelIndex, 0);
        const isSameFilterLR = channelIndex === -1;
        const filterLength = this._filterLength;
        const curve = this._channelCurves[channelIndex];
        const valueCount = this._options.visibleBinCount!;
        const bw = this._sampleRate / filterLength;
        const filterLength2 = (filterLength >>> 1);
        const filter = this._filterKernel.getChannelData(channelIndex);
        const _visibleFrequencies = this._visibleFrequencies;
        /* M = filterLength2, so, M_HALF_PI_FFTLEN2 = (filterLength2 * 0.5 * Math.PI) / filterLength2 */
        const M_HALF_PI_FFTLEN2 = 0.5 * Math.PI;
        let invMaxMag = 1;
        let repeat = Number(this._isNormalized) + 1;

        // fill in all filter points, either averaging or interpolating them as necessary
        do {
            repeat--;
            let i = 1;
            let ii = 0;

            // tslint:disable-next-line:no-constant-condition
            while (true) {
                const freq = bw * i;

                if (freq >= _visibleFrequencies[0]) {
                    break;
                }

                const mag = this.yToMagnitude(curve[0]);
                filter[i << 1] = mag * invMaxMag;
                i++;
            }

            while (bw > _visibleFrequencies[ii + 1] - _visibleFrequencies[ii] &&
                   i < filterLength2 && ii < valueCount - 1) {
                const freq = bw * i;
                let avg = 0;
                let avgCount = 0;

                do {
                    avg += curve[ii];
                    avgCount++;
                    ii++;
                } while (freq > _visibleFrequencies[ii] && ii < valueCount - 1);

                const mag = this.yToMagnitude(avg / avgCount);
                filter[i << 1] = mag * invMaxMag;
                i++;
            }

            for (; i < filterLength2; i++) {
                const freq = bw * i;
                let mag: number;

                if (freq >= _visibleFrequencies[valueCount - 1]) {
                    mag = this.yToMagnitude(curve[valueCount - 1]);
                }
                else {
                    while (ii < (valueCount - 1) && freq > _visibleFrequencies[ii + 1]) {
                        ii++;
                    }

                    mag = this.yToMagnitude(
                        Equalizer._lerp(_visibleFrequencies[ii], curve[ii],
                                       _visibleFrequencies[ii + 1], curve[ii + 1], freq));
                }
                filter[i << 1] = mag * invMaxMag;
            }
            // since DC and Nyquist are purely real, do not bother with them in the for loop,
            // just make sure neither one has a gain greater than 0 dB
            filter[0] = (filter[2] >= 1 ? 1 : filter[2]);
            filter[1] = (filter[filterLength - 2] >= 1 ? 1 : filter[filterLength - 2]);

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
                const k = M_HALF_PI_FFTLEN2 * (i >>> 1);
                /* ****NOTE:
                 * when using FFTReal ou FFTNR, k MUST BE passed as the argument of sin and cos, due to the
                 * signal of the imaginary component
                 * RFFT, intel and other fft's use the opposite signal... therefore, -k MUST BE passed!!
                 */
                filter[i + 1] = (filter[i] * Math.sin(k));
                filter[i] *= Math.cos(k);
            }

            FFTReal(filter, filterLength, -1);

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
            const oldChannelIndex = this._channelIndex;

            this._channelIndex = 1 - channelIndex;
            this.updateFilter(false);
            this._channelIndex = oldChannelIndex;
            return;
        }

        if (this._convolver) {
            this._updateBuffer();
        }
    }

    public updateActualChannelCurve(channelIndex: number) {
        const filterLength = this._filterLength;
        const curve = this._actualChannelCurve;
        const valueCount = this._options.visibleBinCount!;
        const bw = this._sampleRate / filterLength;
        const filterLength2 = (filterLength >>> 1);
        const tmp = this._tmp;
        const _visibleFrequencies = this._visibleFrequencies;
        const filter = this._filterKernel.getChannelData(channelIndex);

        this._applyWindowAndComputeActualMagnitudes(filter);

        // tmp now contains (filterLength2 + 1) magnitudes
        let i = 0;
        let ii = 0;

        while (ii < valueCount - 1 && i < filterLength2 && bw > _visibleFrequencies[ii + 1] - _visibleFrequencies[ii]) {
            let freq = bw * i;

            while (i < filterLength2 && freq + bw < _visibleFrequencies[ii]) {
                i++;
                freq = bw * i;
            }

            curve[ii] = this.magnitudeToY(
                Equalizer._lerp(freq, tmp[i], freq + bw, tmp[i + 1], _visibleFrequencies[ii]));
            ii++;
        }

        i++;

        while (i < filterLength2 && ii < valueCount) {
            let freq: number;
            let avg = 0;
            let avgCount = 0;

            do {
                avg += tmp[i];
                avgCount++;
                i++;
                freq = bw * i;
            } while (freq < _visibleFrequencies[ii] && i < filterLength2);

            curve[ii] = this.magnitudeToY(avg / avgCount);
            ii++;
        }

        i = (this._sampleRate >>> 1) >= _visibleFrequencies[valueCount - 1]
            ? curve[ii - 1]
            : this._options.validYRangeHeight! + 1;

        for (; ii < valueCount; ii++) {
            curve[ii] = i;
        }
    }

    private _applyWindowAndComputeActualMagnitudes(filter: Float32Array): number {
        const filterLength = this._filterLength;
        const tmp = this._tmp;
        const filterLength2 = (filterLength >>> 1);
        const M = filterLength2;
        const PI2_M = 2 * Math.PI / M;

        // it is not possible to know what kind of window the browser will use,
        // so make an assumption here... Blackman window!
        // ...at least it is the one I used, back in C++ times :)
        for (let i = M; i >= 0; i--) {
            /* Hanning window */
            // tmp[i] = filter[i] * (0.5 - (0.5 * cos(PI2_M * i)));
            /* Hamming window */
            // tmp[i] = filter[i] * (0.54 - (0.46 * cos(PI2_M * i)));
            /* Blackman window */
            tmp[i] = filter[i] * (0.42 - (0.5 * Math.cos(PI2_M * i)) + (0.08 * Math.cos(2 * PI2_M * i)));
        }

        for (let i = filterLength - 1; i > M; i--) {
            tmp[i] = 0;
        }

        // calculate the spectrum
        FFTReal(tmp, filterLength, 1);
        // save Nyquist for later
        const ii = tmp[1];
        let maxMag = (tmp[0] > ii ? tmp[0] : ii);

        for (let i = 2; i < filterLength; i += 2) {
            const rval = tmp[i];
            const ival = tmp[i + 1];
            const mag = Math.sqrt((rval * rval) + (ival * ival));

            tmp[i >>> 1] = mag;
            if (mag > maxMag) {
                maxMag = mag;
            }
        }

        // restore Nyquist in its new position
        tmp[filterLength2] = ii;
        return maxMag;
    }

    private static _validateFilterLength(filterLength: number) {
        if (filterLength < 8 || (filterLength & (filterLength - 1))) {
            throw new Error('The FFT size must be power of 2 and not less than 8.');
        }
    }

    private static _lerp(x0: number, y0: number, x1: number, y1: number, x: number): number {
        return ((x - x0) * (y1 - y0) / (x1 - x0)) + y0;
    }

    // virtual properties

    get filterLength(): number {
        return this._filterLength;
    }

    set filterLength(newFilterLength: number) {
        if (this._filterLength !== newFilterLength) {
            Equalizer._validateFilterLength(newFilterLength);
            this._filterLength = newFilterLength;
            this._binCount = (newFilterLength >>> 1) + 1;
            this._filterKernel = this._audioContext.createBuffer(2, newFilterLength, this._sampleRate);
            this._tmp = new Float32Array(newFilterLength);
            this.updateFilter(true);
        }
    }

    get sampleRate(): number {
        return this._sampleRate;
    }

    set sampleRate(newSampleRate: number) {
        if (this.sampleRate !== newSampleRate) {
            this._sampleRate = newSampleRate;
            this._filterKernel = this._audioContext.createBuffer(2, this._filterLength, newSampleRate);
            this.updateFilter(true);
        }
    }

    get isNormalized(): boolean {
        return this._isNormalized;
    }

    set isNormalized(isNormalized: boolean) {
        if (this.isNormalized !== isNormalized) {
            this._isNormalized = isNormalized;
            this.updateFilter(true);
        }
    }

    get audioContext(): AudioContext {
        return this._audioContext;
    }

    set audioContext(newAudioContext: AudioContext) {
        if (this.audioContext !== newAudioContext) {
            const oldConvolver = this._convolver;
            this._convolver.disconnect(0);
            this._audioContext = newAudioContext;
            this._filterKernel = newAudioContext.createBuffer(2, this._filterLength, this._sampleRate);
            (this._convolver as any) = null;
            this.updateFilter(true);
            this._convolver = newAudioContext.createConvolver();
            this._convolver.normalize = false;
            this._convolver.buffer = this._filterKernel;
            this._options.convolverCallback?.(oldConvolver, this._convolver);
        }
    }

    get options(): IEqualizerOptions {
        return deepAssign({}, defaultOptions, this._options);
    }

    get visibleFrequencies(): Float32Array {
        return this._visibleFrequencies;
    }

    get channelCurves(): Int16Array[] {
        return this._channelCurves.slice();
    }

    get actualChannelCurve(): Int16Array {
        return this._actualChannelCurve;
    }

    get convolver(): ConvolverNode {
        return this._convolver;
    }

    get channelIndex(): number {
        return this._channelIndex;
    }

    get zeroChannelValueY(): number {
        return this._zeroChannelValueY;
    }

    get equivalentZonesFrequencyCount(): Float32Array {
        return this._equivalentZonesFrequencyCount;
    }

    set channelIndex(newChannelIndex: number) {
        this._channelIndex = newChannelIndex;
    }
}
