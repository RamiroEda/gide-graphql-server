import { registerEnumType } from "type-graphql";

export enum PropertyType {
    DEPARTMENT = "department",
    HOUSE = "house"
}

registerEnumType(PropertyType, {
    name: "PropertyType",
    description: "Tipo de inmueble"
});