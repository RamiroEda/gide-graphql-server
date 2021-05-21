import { ArgsType, Field, ID, Int } from "type-graphql";
import { MapBounds } from "../inputs/map_bounds.input";

@ArgsType()
export class PropertiesArguments {
    @Field(type => [ID], {nullable: true})
    only?: string[];

    @Field(type => MapBounds, {nullable: true})
    inMapBounds?: MapBounds;

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