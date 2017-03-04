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

import defaultLocale from '../locales/en.json';

import ILocale from './ILocale';

interface ILocaleSet {
    [langId: string]: ILocale;
}

const defaultLanguage = 'en';

export default class L10n {

    private _language: string;
    private _locales: ILocaleSet = {};

    constructor(language: string = defaultLanguage) {
        this._language = language;
        this.loadLocale(defaultLanguage, defaultLocale);
    }

    public loadLocale(language: string, locale: ILocale) {
        this._locales[language] = locale;
    }

    public get(tag: string) {
        let locales = this._locales[this._language] || this._locales[defaultLanguage];

        if (locales[tag] === undefined) {
            locales = this._locales[defaultLanguage];
        }

        return locales[tag];
    }

    public format(str: string, ...args: any[]): string {
        str = this.get(str);
        args.forEach((arg: any, i: number) => {
            str = str.replace(new RegExp(`\\{${i}\\}`, 'g'), arg.toLocaleString(this._language));
        });

        return str;
    }

    get language(): string {
        return this._language;
    }

    set language(language: string) {
        this._language = language;
    }
}
