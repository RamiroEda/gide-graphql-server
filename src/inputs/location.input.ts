import { Field, Float, InputType } from "type-graphql";
import { Location } from "../models/location.model";


@InputType()
export class LocationInput implements Location {
    @Field(type => Float)
    latitude: number;

    @Field(type => Float)
    longitude: number;
}