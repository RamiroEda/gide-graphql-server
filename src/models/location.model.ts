import { prop } from "@typegoose/typegoose";
import { Field, Float, ObjectType } from "type-graphql";
import { GeoJSONPoint } from "./geojson.model";

@ObjectType()
export class Location {
    @prop()
    @Field(type => Float)
    latitude: number;

    @prop()
    @Field(type => Float)
    longitude: number;
}

export function locationToGeoJSON(location: Location): GeoJSONPoint {
    return {
        type: "Point",
        coordinates: [location.latitude, location.longitude]
    };
}