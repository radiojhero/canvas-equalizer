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

// miscellaneous functions

(function(window: Window) {
    try {
        new CustomEvent('test');
    } catch (error) {
        return; // no need to polyfill
    }

    // polyfills DOM4 CustomEvent
    function MouseEvent(
        eventType: string,
        parameters: MouseEventInit = { bubbles: false, cancelable: false },
    ) {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const mouseEvent = document.createEvent('MouseEvent');
        mouseEvent.initMouseEvent(
            eventType,
            parameters.bubbles!,
            parameters.cancelable!,
            window,
            1,
            parameters.screenX!,
            parameters.screenY!,
            parameters.clientX!,
            parameters.clientY!,
            parameters.ctrlKey!,
            parameters.altKey!,
            parameters.shiftKey!,
            parameters.metaKey!,
            0,
            null,
        );

        return mouseEvent;
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
    }

    MouseEvent.prototype = Event.prototype;

    (window as any).MouseEvent = MouseEvent;
})(window);

type PointerEventShortName = 'down' | 'move' | 'up';
type AttachDetachSignature = (
    observable: EventTarget,
    eventName: PointerEventShortName,
    targetFunction: (e: MouseEvent) => any,
    capturePhase?: boolean,
) => void;

let attachPointer: AttachDetachSignature;
let detachPointer: AttachDetachSignature;

function unwrap(func: any, tag: string, element: EventTarget): any {
    const wrapperTag = `__${tag}_wrapper__`;

    let returnValue;

    if (func[wrapperTag]) {
        func[wrapperTag] = func[wrapperTag].filter(
            (entry: { elem: EventTarget; wrapper: any }) => {
                if (entry.elem === element) {
                    returnValue = entry.wrapper;
                    return false;
                }

                return true;
            },
        );
    }

    return returnValue;
}

function wrap(func: any, wrapper: any, tag: string, element: EventTarget): any {
    const wrapperTag = `__${tag}_wrapper__`;

    if (!func[wrapperTag]) {
        func[wrapperTag] = [];
    }

    unwrap(func, tag, element);
    func[wrapperTag].push({ elem: element, wrapper });
    return wrapper;
}

export function cancelEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

if ((window as any).PointerEvent) {
    attachPointer = function(
        observable: EventTarget,
        eventName: PointerEventShortName,
        targetFunction: (e: MouseEvent) => any,
        capturePhase?: boolean,
    ) {
        observable.addEventListener(
            `pointer${eventName}`,
            targetFunction as EventListener,
            capturePhase,
        );
    };
    detachPointer = function(
        observable: EventTarget,
        eventName: PointerEventShortName,
        targetFunction: (e: MouseEvent) => any,
        capturePhase?: boolean,
    ) {
        observable.removeEventListener(
            `pointer${eventName}`,
            targetFunction as EventListener,
            capturePhase,
        );
    };
} else if ('ontouchend' in document) {
    const mappings = {
        down: ['start'],
        move: ['move'],
        up: ['end', 'cancel'],
    };
    attachPointer = function(
        observable: EventTarget,
        eventName: PointerEventShortName,
        targetFunction: (e: MouseEvent) => any,
        capturePhase?: boolean,
    ) {
        const wrapper = (event: TouchEvent) => {
            const touch = event.changedTouches[0];
            const pseudoMouse = new MouseEvent(`mouse${eventName}`, {
                altKey: event.altKey,
                clientX: (touch && touch.clientX) || 0,
                clientY: (touch && touch.clientY) || 0,
                ctrlKey: event.ctrlKey,
                metaKey: event.metaKey,
                screenX: (touch && touch.screenX) || 0,
                screenY: (touch && touch.screenY) || 0,
                shiftKey: event.shiftKey,
            });

            (pseudoMouse as any).clonedFromTouch = true;

            const result = targetFunction(pseudoMouse);

            if (result === false || pseudoMouse.defaultPrevented) {
                cancelEvent(event);
            }

            return result;
        };

        mappings[eventName].forEach(mapping => {
            observable.addEventListener(
                `touch${mapping}`,
                wrap(targetFunction, wrapper, `touch${eventName}`, observable),
                capturePhase,
            );
        });
    };
    detachPointer = function(
        observable: EventTarget,
        eventName: PointerEventShortName,
        targetFunction: (e: MouseEvent) => any,
        capturePhase?: boolean,
    ) {
        mappings[eventName].forEach(mapping => {
            observable.removeEventListener(
                `touch${mapping}`,
                unwrap(targetFunction, `touch${eventName}`, observable),
                capturePhase,
            );
        });
    };
} else {
    attachPointer = function(
        observable: EventTarget,
        eventName: PointerEventShortName,
        targetFunction: (e: MouseEvent) => any,
        capturePhase?: boolean,
    ) {
        observable.addEventListener(
            `mouse${eventName}`,
            targetFunction as EventListener,
            capturePhase,
        );
    };
    detachPointer = function(
        observable: EventTarget,
        eventName: PointerEventShortName,
        targetFunction: (e: MouseEvent) => any,
        capturePhase?: boolean,
    ) {
        observable.removeEventListener(
            `mouse${eventName}`,
            targetFunction as EventListener,
            capturePhase,
        );
    };
}

const runningFuncs: (() => void)[] = [];

export { attachPointer, detachPointer };

/* tslint:disable:no-magic-numbers object-literal-sort-keys */
export const keyFix: any = {
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
    Delete: 46,
};
/* tslint:enable:no-magic-numbers object-literal-sort-keys */

export function keyPressed(event: KeyboardEvent, ...chars: string[]) {
    for (const chr of chars) {
        if (Object.keys(keyFix).includes(chr)) {
            const [key, keyCode] = Array.isArray(keyFix[chr])
                ? keyFix[chr]
                : [chr, keyFix[chr]];
            if (event.key === key || event.keyCode === keyCode) {
                return true;
            }
        }
    }
    return false;
}

export function throttledFunction(func: () => void, timeout?: number) {
    if (!runningFuncs.includes(func)) {
        runningFuncs.push(func);
        const wrapper = () => {
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

export function addThrottledEvent(
    observable: EventTarget,
    eventName: string,
    targetFunction: (e?: Event) => any,
    capturePhase?: boolean,
) {
    let running = false;
    const wrapper = (event: Event) => {
        if (!running) {
            running = true;
            requestAnimationFrame(() => {
                targetFunction(event);
                running = false;
            });
        }
    };

    observable.addEventListener(
        eventName,
        wrap(targetFunction, wrapper, `throttle${eventName}`, observable),
        capturePhase,
    );
}

export function removeThrottledEvent(
    observable: EventTarget,
    eventName: string,
    targetFunction: (e?: Event) => any,
    capturePhase?: boolean,
) {
    observable.removeEventListener(
        eventName,
        unwrap(targetFunction, `throttle${eventName}`, observable),
        capturePhase,
    );
}

export function elementCoordinates(element: HTMLElement, event: MouseEvent) {
    const rect = element.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

export function devicePixelRatio() {
    return window.devicePixelRatio || 1;
}
