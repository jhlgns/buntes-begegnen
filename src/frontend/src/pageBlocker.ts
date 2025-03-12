import { LocationHook } from "preact-iso";
import { useEffect } from "preact/hooks";

let _shouldBlock: (() => string | null) | null = null;
let _pageBlockerWasSetUp = false;

// Call this before the LocationProvider gets rendered
export function setupPageBlocker() {
    if (_pageBlockerWasSetUp) {
        return;
    }

    _pageBlockerWasSetUp = true;

    const listener = (event: Event) => {
        if (_shouldBlock == null) {
            return;
        }

        const link = event.type != "click" ? null : (event.target as HTMLElement).closest("a[href]") as HTMLLinkElement | null;
        if (event.type == "click" && link == null) {
            return;
        }

        const message = _shouldBlock();
        if (message == null) {
            return;
        }

        console.debug("Asking user for confirmation on event of type", event.type, "on", event.target, "because the page blocker is active, event:", event);

        const confirmed = confirm(message);
        if (confirmed) {
            console.debug("The confirmation was given, allowing the event to pass");

            // Disable the blocker if the event is a click event and confirmed by the user
            // because next, beforeunload happens which should not need to be confirmed again
            if (event.type == "click" && link != null) {
                const href = link.attributes.getNamedItem("href")!.value;
                const isExternalLink = new URL(document.baseURI).origin !== new URL(href, document.baseURI).origin;
                if (isExternalLink) {
                    _shouldBlock = null;
                }
            }

            return;
        }

        console.debug("Confirmaton was not given, blocking the event");

        event.preventDefault();
        event.stopImmediatePropagation();
    }

    window.addEventListener("click", listener);
    window.addEventListener("beforeunload", listener);
    window.addEventListener("popstate", listener);
}

export function usePageBlocker(shouldBlock: () => string | null) {
    useEffect(() => {
        _shouldBlock = shouldBlock;
        return () => _shouldBlock = null;
    }, []);
}

// TODO: Make sure this function is used instead of the underlying one
export function doRoute(location: LocationHook, url: string) {
    const message = _shouldBlock == null ? null : _shouldBlock();
    if (message != null) {
        const confirmed = confirm(message);
        if (confirmed == false) {
            return;
        }
    }

    location.route(url);
}