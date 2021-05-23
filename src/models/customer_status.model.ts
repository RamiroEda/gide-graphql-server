import { registerEnumType } from "type-graphql";

export enum CustomerStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
}


registerEnumType(CustomerStatus, {
    name: "CustomerStatus",
    description: "Estado en el que se encuentra la solicitud de contacto"
});