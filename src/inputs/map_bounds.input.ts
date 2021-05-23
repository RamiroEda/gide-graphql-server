import { Field, InputType } from "type-graphql";
import { LocationInput } from "./location.input";


@InputType({description: "Entrada del area geografica rectangular definida por dos puntos diagonales."})
export class MapBoundsInput {
    @Field(type => LocationInput, {description: "Punto en la esquina superior derecha"})
    northEast: LocationInput;

    @Field(type => LocationInput, {description: "Punto en la esquina inferior izquierda"})
    southWest: LocationInput;
}