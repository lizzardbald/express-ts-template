import { Routes } from "../config/Routes.enum";

export interface Constructable<T> {
    path?: Routes;
    new(...args: any) : T;
}
