import { Field, InputType, ObjectType } from "type-graphql";
import { LocationInput } from "./location.input";


@InputType()
export class MapBounds {
    @Field(type => LocationInput)
    northEast: LocationInput;

    @Field(type => LocationInput)
    southWest : LocationInput;
}