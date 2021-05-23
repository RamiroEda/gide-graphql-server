import { prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Location } from "./location.model";


@ObjectType({description: "Area geografica rectangular definida por dos puntos diagonales."})
export class MapBounds {
    @prop()
    @Field(type => Location, {description: "Punto en la esquina superior derecha"})
    northEast: Location;

    @prop()
    @Field(type => Location, {description: "Punto en la esquina inferior izquierda"})
    southWest: Location;
}