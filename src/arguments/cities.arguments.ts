import { Max, Min } from "class-validator";
import { ArgsType, Field, Int } from "type-graphql";
import { CitiesFilter } from "../filters/cities.filter";
import { PaginationArguments } from "./pagination.arguments";

@ArgsType()
export class CitiesArguments extends PaginationArguments {
    @Field(type => CitiesFilter, {nullable: true, description: "Va a devolver los documentos que cumplan con los requisitos definidos"})
    find?: CitiesFilter;

    @Field(type => Int, {description: "Limita el numero de elementos retornados a la cantidad especificada o menos"})
    @Min(1)
    @Max(100)
    limit: number;

    @Field(type => Int, {nullable: true, description: "Salta el numero de elementos especificados"})
    skip?: number;
}