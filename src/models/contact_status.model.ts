import { registerEnumType } from "type-graphql";

export enum ContactStatus {
    PENDING = "pending",
    COMPLETED = "completed"
}

registerEnumType(ContactStatus, {
    name: "ContactStatus",
    description: "El estado en el que se encuentra la solicitud de contacto del cliente"
});