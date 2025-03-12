import { Signal } from "@preact/signals";
import { JSX } from "preact";

export type SignalLike<T> = JSX.SignalLike<T>;
export type Signalish<T> = JSX.Signalish<T>;

export function incr(signal: Signal<number>, delta: number = 1) {
    signal.value = signal.peek() + delta;
}

export function readValue<T>(valueOrSignal: Signalish<T>): T {
    // TODO: This might not be enough of a condition, what if T contains a property named "value"?
    const prototype = Object.getPrototypeOf(valueOrSignal);
    const isSignal = Object.hasOwn(prototype, "value");

    if (isSignal) {
        //console.debug(valueOrSignal, "is a signal");
        const signal = valueOrSignal as Signal<T>;
        return signal.value;
    }

    // console.debug(valueOrSignal, "is NOT a signal");
    const value = valueOrSignal as T;

    return value;
}
