import { Field, InputType, ObjectType } from "type-graphql";
import { MapBounds } from "../models/map_bounds.model";
import { LocationInput } from "./location.input";


@InputType()
export class MapBoundsInput {
    @Field(type => LocationInput)
    northEast: LocationInput;

    @Field(type => LocationInput)
    southWest : LocationInput;
}