import { ArgsType, Field, Int } from "type-graphql";
import { ZonesFilter } from "../filters/zones.filter";
import { PaginationArguments } from "./pagination.arguments";

@ArgsType()
export class ZonesArguments extends PaginationArguments {
    @Field(type => ZonesFilter, {nullable: true, description: "Va a devolver unicamente los IDs especificados"})
    find?: ZonesFilter;

    @Field(type => Int, {description: "Limita el numero de elementos retornados a la cantidad especificada o menos"})
    limit: number;

    @Field(type => Int, {nullable: true, description: "Salta el numero de elementos especificados"})
    skip?: number;
}