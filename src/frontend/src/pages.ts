class Page {
    public constructor(
        public path: string,
        public queryParameters?: [[string, string | undefined]],
        public template?: string,
    ) {
    }

    public buildUrl(): URL {
        //console.log("buildUrl - path:", path);
        //console.log("buildUrl - window.location.host:", window.location.host);

        const result = new URL(window.location.protocol + "//" + window.location.host);
        result.pathname = this.path;

        if (this.queryParameters != undefined) {
            for (const [key, value] of this.queryParameters) {
                if (value != undefined) {
                    result.searchParams.append(key, value);
                }
            }
        }

        // console.log("buildUrl - result:", result);

        return result;
    }
}

export class Pages {
    public static home() {
        return new Page("/");
    }

    public static contact() {
        return new Page("/kontakt");
    }

    public static about() {
        return new Page("/ueber-das-projekt");
    }

    public static activityList() {
        return new Page("/veranstaltungen");
    }

    public static activityDetail(id?: number, instance?: Date) {
        return new Page("/veranstaltungen/" + id, [["instance", instance?.valueOf()?.toString()]], "/veranstaltungen/:id");
    }

    public static activityEditor(id?: number) {
        return new Page("/veranstaltungen/" + id + "/bearbeiten", undefined, "/veranstaltungen/:id/bearbeiten");
    }

    public static privacy() {
        return new Page("/datenschutz");
    }

    public static imprint() {
        return new Page("/impressum");
    }

    public static login(returnUrl?: string) {
        return new Page("/anmeldung", [["returnUrl", returnUrl]]);
    }

    public static logout() {
        return new Page("/abmeldung");
    }

    public static registration(returnUrl?: string) {
        return new Page("/registrierung", [["returnUrl", returnUrl]]);
    }

    public static changePassword(returnUrl?: string) {
        return new Page("/passwort-aendern", [["returnUrl", returnUrl]]);
    }

    public static profile() {
        return new Page("/profil");
    }

    public static admin() {
        return new Page("/admin");
    }

    public static debug() {
        return new Page("/debug");
    }

    public static notFound() {
        return new Page("/404");
    }
}