type Defined<T> = T extends undefined ? never : T;

// TODO: This does not do yet what I really want, which is to prevent missing keys
export type AllDefined<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
}
