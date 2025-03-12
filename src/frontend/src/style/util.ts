import { CSSProperties } from "preact/compat";

export function flexRow(props?: {
    crossAxisAlignment?: string,
    mainAxisAlignment?: string,
    gap?: string,
    wrap?: boolean,
}) {
    return displayFlex({ direction: "row", ...props });
}

export function flexColumn(props?: {
    crossAxisAlignment?: string,
    mainAxisAlignment?: string,
    gap?: string,
    wrap?: boolean,
}) {
    return displayFlex({ direction: "column", ...props });
}

export function displayFlex(props: {
    direction: string,
    crossAxisAlignment?: string,
    mainAxisAlignment?: string,
    gap?: string,
    wrap?: boolean,
}): CSSProperties {
    return {
        display: "flex",
        flexDirection: props.direction,
        alignItems: props.crossAxisAlignment ?? "center",
        justifyContent: props.mainAxisAlignment ?? "center",
        gap: props.gap ?? "0",
        flexWrap: props.wrap ? "wrap" : undefined,
    };
}

// TODO: Do we really need that? Or was that just for experimenting?
export function displayInlineFlex(props: {
    direction: string,
    crossAxisAlignment?: string,
    mainAxisAlignment?: string,
    gap?: string,
    wrap?: boolean,
}): CSSProperties {
    return {
        display: "inline-flex",
        flexDirection: props.direction,
        alignItems: props.crossAxisAlignment ?? "center",
        justifyContent: props.mainAxisAlignment ?? "center",
        gap: props.gap ?? "0",
        flexWrap: props.wrap ? "wrap" : undefined,
    };
}
