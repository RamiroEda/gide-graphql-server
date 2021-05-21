import { Auth } from "./auth.model";

export interface GideContext {
    auth?: Auth;
}


export enum AuthRole{
    ADMIN = "ADMIN"
}