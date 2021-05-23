import { Field, Float, InputType } from "type-graphql";
import { Location } from "../models/location.model";


@InputType({description: "Entrada de un punto geografico"})
export class LocationInput implements Location {
    @Field(type => Float, {description: "Distancia angular que hay desde un punto de la superficie de la Tierra hasta el paralelo del ecuador."})
    latitude: number;

    @Field(type => Float, {description: "Distancia angular entre un punto dado de la superficie terrestre y el meridiano."})
    longitude: number;
}