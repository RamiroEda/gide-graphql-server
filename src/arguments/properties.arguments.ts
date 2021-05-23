import { ArgsType, Field, ID, Int } from "type-graphql";
import { MapBoundsInput } from "../inputs/map_bounds.input";
import { FilterArguments } from "./filter.arguments";
import { PaginationArguments } from "./pagination.arguments";

@ArgsType()
export class PropertiesArguments implements PaginationArguments, FilterArguments {
    @Field(type => [ID], {nullable: true, description: "Va a devolver unicamente los IDs especificados"})
    only?: string[];

    @Field(type => MapBoundsInput, {nullable: true, description: "Filtra los inmuebles a solo los que se encuentran dentro de un area geografica rectangular"})
    inMapBounds?: MapBoundsInput;

    @Field(type => ID, {nullable: true, description: "Filtra por estado de la republica"})
    filterByStateId?: string;

    @Field(type => ID, {nullable: true, description: "Filtra por ciudad dentro del estado"})
    filterByCityId?: string;

    @Field(type => ID, {nullable: true, description: "Filtra por zona dentro de la ciudad"})
    filterByZoneId?: string;

    @Field(type => Int, {nullable: true, description: "Limita el numero de elementos retornados a la cantidad especificada o menos"})
    limit?: number;

    @Field(type => Int, {nullable: true, description: "Salta el numero de elementos especificados"})
    skip?: number;
}