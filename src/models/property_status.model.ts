import { registerEnumType } from "type-graphql";

export enum PropertyStatus {
    SOLD = "sold",
    AVAILABLE = "available"
}

registerEnumType(PropertyStatus, {
    name: "PropertyStatus",
    description: "Estado en el que se encuentra el inmueble dentro del sistema de compraventa"
});