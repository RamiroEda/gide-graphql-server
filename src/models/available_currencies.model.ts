import { registerEnumType } from "type-graphql";

export enum AvailableCurrency {
    MXN = "mxn",
    USD = "usd",
}

export const AVAILABLE_CURRECIES: string[] = Object.keys(AvailableCurrency);

registerEnumType(AvailableCurrency, {
    name: "AvailableCurrencies",
    description: "Las monedas disponibles dentro del sistema"
});