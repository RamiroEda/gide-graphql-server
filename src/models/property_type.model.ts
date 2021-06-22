import { registerEnumType } from "type-graphql";

export enum PropertyType {
    DEPARTMENT = "department",
    HOUSE = "house",
    ROOM = "room",
    STORE = "store",
    SHOP = "shop",
    OFFICE = "office",
    LAND = "land",
    HOTEL = "hotel",
    BUILDING = "building"
}

registerEnumType(PropertyType, {
    name: "PropertyType",
    description: "Tipo de inmueble"
});