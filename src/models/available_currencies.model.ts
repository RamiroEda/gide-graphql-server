import { registerEnumType } from "type-graphql";

export enum AvailableCurrency {
    MXN = "mxn",
    USD = "usd",
}

registerEnumType(AvailableCurrency, {
    name: "AvailableCurrencies",
    description: "Las monedas disponibles dentro del sistema"
});