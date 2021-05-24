import { ArgsType, Field, Int } from "type-graphql";
import { PropertiesFilter } from "../filters/properties.filter";
import { PaginationArguments } from "./pagination.arguments";

@ArgsType()
export class PropertiesArguments extends PaginationArguments {
    @Field(type => PropertiesFilter, {nullable: true, description: "Va a devolver los documentos que cumplan con los requisitos definidos"})
    find?: PropertiesFilter;

    @Field(type => Int, {description: "Limita el numero de elementos retornados a la cantidad especificada o menos"})
    limit: number;

    @Field(type => Int, {nullable: true, description: "Salta el numero de elementos especificados"})
    skip?: number;
}