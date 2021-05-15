import { ArgsType, Field, Int } from "type-graphql";
import { MapBounds } from "../inputs/map_bounds.input";

@ArgsType()
export class PropertiesArguments {
    @Field(type => [String], {nullable: true})
    only?: string[];

    @Field(type => MapBounds, {nullable: true})
    inMapBounds?: MapBounds;

    @Field(type => Int, {nullable: true})
    limit?: number;

    @Field(type => Int, {nullable: true})
    skip?: number;
}