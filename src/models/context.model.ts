import { registerEnumType } from "type-graphql";
import { Auth } from "./auth.model";

export interface GideContext {
    auth?: Auth;
}


export enum AuthRole {
    ADMIN = "ADMIN"
}


registerEnumType(AuthRole, {
    name: "AuthRole",
    description: "Rol al que pertenece el usuario"
});