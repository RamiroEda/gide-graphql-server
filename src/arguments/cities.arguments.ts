import { ArgsType, Field, ID, Int } from "type-graphql";
import { FilterArguments } from "./filter.arguments";
import { PaginationArguments } from "./pagination.arguments";

@ArgsType()
export class CitiesArguments implements PaginationArguments, FilterArguments {
    @Field(type => [ID], {nullable: true, description: "Va a devolver unicamente los IDs especificados"})
    only?: string[];

    @Field(type => Int, {nullable: true, description: "Limita el numero de elementos retornados a la cantidad especificada o menos"})
    limit?: number;

    @Field(type => Int, {nullable: true, description: "Salta el numero de elementos especificados"})
    skip?: number;
}