import { Signal, signal, useSignal } from "@preact/signals";
import { CSSProperties, useEffect } from "preact/compat"

const contentWidth = signal<string | null>(null);

export function useContentWidth(width: string) {
    useEffect(
        () => {
            contentWidth.value = width;
            return () => contentWidth.value = null;
        },
        []
    );
}

export function centeredContent(): CSSProperties {
    return {
        maxWidth: contentWidth.value ?? "85ch",
        marginLeft: "auto",
        marginRight: "auto",
    };
}

function useWindowSize(): Signal<{ width: number, height: number }> {
    const result = useSignal<{ width: number, height: number }>({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handler = () => {
            result.value = { width: window.innerWidth, height: window.innerHeight };
        }

        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    return result;
}

export function useIsLargerThanMobile(): boolean {
    const windowSize = useWindowSize();
    return windowSize.value.width > breakpoints.small;
}

const breakpoints = {
    small: 767,
    medium: 992,
    large: 1200,
};
