import { ArgsType, Field, Int } from "type-graphql";
import { StatesFilter } from "../filters/states.filter";
import { PaginationArguments } from "./pagination.arguments";

@ArgsType()
export class StatesArguments extends PaginationArguments {
    @Field(type => StatesFilter, {nullable: true, description: "Va a devolver los documentos que cumplan con los requisitos definidos"})
    find?: StatesFilter;

    @Field(type => Int, {description: "Limita el numero de elementos retornados a la cantidad especificada o menos"})
    limit: number;

    @Field(type => Int, {nullable: true, description: "Salta el numero de elementos especificados"})
    skip?: number;
}