import { prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Location } from "./location.model";


@ObjectType()
export class MapBounds {
    @prop()
    @Field(type => Location)
    northEast: Location;

    @prop()
    @Field(type => Location)
    southWest : Location;
}