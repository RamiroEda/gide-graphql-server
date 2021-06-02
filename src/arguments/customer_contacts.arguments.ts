import { ArgsType, Field, Int } from "type-graphql";
import { CustomerContactsFilter } from "../filters/customer_contacts.filter";
import { PaginationArguments } from "./pagination.arguments";

@ArgsType()
export class CustomerContactsArguments extends PaginationArguments {
    @Field(type => CustomerContactsFilter, {nullable: true, description: "Va a devolver los documentos que cumplan con los requisitos definidos"})
    find?: CustomerContactsFilter;

    @Field(type => Int, {description: "Limita el numero de elementos retornados a la cantidad especificada o menos"})
    limit: number;

    @Field(type => Int, {nullable: true, description: "Salta el numero de elementos especificados"})
    skip?: number;
}