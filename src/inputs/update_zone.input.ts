import { Field, ID, InputType } from "type-graphql";
import { MapBoundsInput } from "./map_bounds.input";

@InputType()
export class UpdateZoneInput{
    @Field(type => ID, {description: "ID de la zona a actualizar"})
    _id: string;

    @Field({nullable: true, description: "Nombre de la zona"})
    name: string;

    @Field(type => MapBoundsInput, {nullable: true, description: "Area geografica rectangular que delimita la zona"})
    bounds: MapBoundsInput;
}