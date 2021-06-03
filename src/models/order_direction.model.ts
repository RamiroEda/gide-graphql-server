import { registerEnumType } from "type-graphql";

export enum OrderDirection {
    ASC = 1,
    DESC = -1
}

registerEnumType(OrderDirection, {
    name: "OrderDirection",
    description: "Direccion del ordenamiento"
});