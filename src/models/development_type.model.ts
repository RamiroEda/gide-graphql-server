import { registerEnumType } from "type-graphql";

export enum DevelopmentType {
    PRIVATE = "private"
}

registerEnumType(DevelopmentType, {
    name: "DevelopmentType",
    description: "El tipo de desarrollo llevado a cabo en la zona residencial del inmueble"
});