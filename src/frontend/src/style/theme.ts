export class Theme {
    //
    // Theme
    //

    public static readonly borderRadius = "10px";

    public static readonly default = {
        fg: "#021627"
    };

    public static readonly green = {
        bg: "#efffda",
        fg: Theme.default.fg,
        fgLight: "#87bb00",
    };

    public static readonly pink = {
        bg: "#ffacce",
        fg: Theme.default.fg,
    };

    public static readonly blue = {
        bg: "#cbd9fd",
        fg: "#5f8bfa",
        fgAlt: "#f35fa4",
    };

    public static readonly error = {
        fg: "#994444",
        bg: "#e9adad",  // TODO: Constrast to low
        border: "#771919",
    };

    public static readonly interactive = {
        boxShadow: "0px 0px 8px #9999aa",
        borderRadius: Theme.borderRadius,
    };

    //
    // General classes
    //

    public static readonly info = {
        fg: "#242d44",
        bg: "#cadaff",
    };

    public static readonly success = {
        bg: "#a3edad",
        fg: "#033c19",
    };

    public static readonly warning = {
        bg: "#fff4d9",
        fg: "#5e594d",
    };

    public static readonly invalid = {
        fg: "#994444",
    };

    public static readonly inactive = {
        fg: "gray",
    };

    public static readonly popup = {
        bg: "#222222aa",
        contentBg: "white",
    };

    //
    // Elements
    //

    public static readonly header = {
        fg: Theme.default.fg,
        bg: Theme.blue.bg,
        fgActive: "#ff009d",
    };

    // TODO
    public static readonly burgerMenu = {
        fg: Theme.pink.fg,
        bg: Theme.pink.bg,
    };

    public static readonly footer = {
        bg: "lightgrey",
        fg: "grey",
    };

    public static readonly sideBar = {
        bg: "#bbccff",
        fg: "#002200",
    };

    public static readonly activityListItem = {
        bg: Theme.pink.bg,
        fg: Theme.default.fg,
        bgDraft: "lightgray",
        fgDraft: "gray",
        fgDate: "black",
        bgDate: "white", // Theme.pink.fg,
    };

    public static readonly fieldset = {
        bg: Theme.green.bg,
        fg: Theme.default.fg,
        border: "#9ab361",
    };

    public static readonly button = {
        bg: "green",
        fg: "black",  // TODO
    };

    public static breadcrumb = {
        fg: "gray",
    }
}
