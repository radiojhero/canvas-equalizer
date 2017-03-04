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

export function FFTComplex(data: Float32Array, n: number, isign: number) {
    const nn = n << 1;
    let mmax: number;
    let m: number;
    let j = 1;
    let istep: number;
    let i: number;
    let wr: number;
    let wpr: number;
    let wpi: number;
    let wi: number;
    let theta: number;
    let tempr: number;
    let tempi: number;
    let halfmmax: number;
    let dj1: number;
    let dj: number;

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

        halfmmax = ((mmax >>> 1) + 1);

        for (m = 3; m < halfmmax; m += 2) {
            for (i = m; i <= nn; i += istep) {
                j = i + mmax;
                tempr = (wr * (dj1 = data[j - 1])) - (wi * (dj = data[j]));
                tempi = (wr * dj) + (wi * dj1);
                data[j - 1] = data[i - 1] - tempr;
                data[j] = data[i] - tempi;
                data[i - 1] += tempr;
                data[i] += tempi;
            }
            wr += ((tempr = wr) * wpr) - (wi * wpi);
            wi += (wi * wpr) + (tempr * wpi);
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
        }
        else {
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
                tempr = (wr * (dj1 = data[j - 1])) - (wi * (dj = data[j]));
                tempi = (wr * dj) + (wi * dj1);
                data[j - 1] = data[i - 1] - tempr;
                data[j] = data[i] - tempi;
                data[i - 1] += tempr;
                data[i] += tempi;
            }
            wr += ((tempr = wr) * wpr) - (wi * wpi);
            wi += (wi * wpr) + (tempr * wpi);
        }

        mmax = istep;
    }
}

export function FFTReal(data: Float32Array, n: number, isign: number) {
    let i: number;
    let i1: number;
    let i2: number;
    let i3: number;
    let i4: number;
    let d1: number;
    let d2: number;
    let d3: number;
    let d4: number;
    const n4 = n >>> 2;
    let c2: number;
    let h1r: number;
    let h1i: number;
    let h2r: number;
    let h2i: number;
    let wr: number;
    let wi: number;
    let wpr: number;
    let wpi: number;
    let theta = Math.PI / (n >>> 1);

    if (isign === 1) {
        c2 = -0.5;
        FFTComplex(data, n >>> 1, 1);
    }
    else {
        c2 = 0.5;
        theta = -theta;
    }

    wpr = Math.sin(0.5 * theta);
    wr = 1.0 + (wpr *= (-2.0 * wpr));
    wi = (wpi = Math.sin(theta));

    for (i = 1; i < n4; i++) {
        i2 = 1 + (i1 = (i << 1));
        i4 = 1 + (i3 = (n - i1));
        h1r = 0.5 * ((d1 = data[i1]) + (d3 = data[i3]));
        h1i = 0.5 * ((d2 = data[i2]) - (d4 = data[i4]));
        h2r = -c2 * (d2 + d4);
        h2i = c2 * (d1 - d3);
        data[i1] = h1r + (d1 = (wr * h2r)) - (d2 = (wi * h2i));
        data[i2] = h1i + (d3 = (wr * h2i)) + (d4 = (wi * h2r));
        data[i3] = h1r - d1 + d2;
        data[i4] = d3 + d4 - h1i;
        wr += ((h1r = wr) * wpr) - (wi * wpi);
        wi += (wi * wpr) + (h1r * wpi);
    }

    if (isign === 1) {
        data[0] = (h1r = data[0]) + data[1];
        data[1] = h1r - data[1];
    }
    else {
        data[0] = 0.5 * ((h1r = data[0]) + data[1]);
        data[1] = 0.5 * (h1r - data[1]);
        FFTComplex(data, n >>> 1, -1);
        h1r = 2.0 / n;

        for (i = n - 1; i >= 0; i--) {
            data[i] *= h1r;
        }
    }
}
