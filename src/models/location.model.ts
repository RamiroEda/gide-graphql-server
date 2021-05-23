import { prop } from "@typegoose/typegoose";
import { Field, Float, ObjectType } from "type-graphql";
import { GeoJSONPoint } from "./geojson.model";

@ObjectType({description: "Coordenadas geograficas"})
export class Location {
    @prop()
    @Field(type => Float, {description: "Distancia angular que hay desde un punto de la superficie de la Tierra hasta el paralelo del ecuador."})
    latitude: number;

    @prop()
    @Field(type => Float, {description: "Distancia angular entre un punto dado de la superficie terrestre y el meridiano."})
    longitude: number;
}

export function locationToGeoJSON(location: Location): GeoJSONPoint {
    return {
        type: "Point",
        coordinates: [location.latitude, location.longitude]
    };
}