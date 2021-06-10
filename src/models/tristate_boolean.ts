import { registerEnumType } from "type-graphql";

export enum TristateBoolean {
    TRUE,
    FALSE,
    NULL
}

registerEnumType(TristateBoolean, {
    name: "TristateBoolean",
    description: "Booleano de 3 estados: true, false y null"
});