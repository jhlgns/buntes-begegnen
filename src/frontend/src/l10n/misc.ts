export function joinUnd(elements: string[]): string {
    if (elements.length == 0) {
        return "";
    }

    if (elements.length == 1) {
        return elements[0]!;
    }

    const head = elements.slice(undefined, elements.length - 1);
    const last = elements[elements.length - 1];

    return `${head.join(", ")} und ${last}`;
}
