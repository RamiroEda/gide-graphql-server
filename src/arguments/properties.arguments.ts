import { ArgsType, Field, ID, Int } from "type-graphql";
import { MapBoundsInput } from "../inputs/map_bounds.input";
import { PaginationArguments } from "./pagination.arguments";

@ArgsType()
export class PropertiesArguments implements PaginationArguments {
    @Field(type => [ID], {nullable: true})
    only?: string[];

    @Field(type => MapBoundsInput, {nullable: true})
    inMapBounds?: MapBoundsInput;

    @Field(type => ID, {nullable: true})
    filterByStateId?: string;

    @Field(type => ID, {nullable: true})
    filterByCityId?: string;

    @Field(type => ID, {nullable: true})
    filterByZoneId?: string;

    @Field(type => Int, {nullable: true})
    limit?: number;

    @Field(type => Int, {nullable: true})
    skip?: number;
}