import { Field, ID, InputType } from "type-graphql";
import { MapBoundsInput } from "./map_bounds.input";

@InputType()
export class UpdateStateInput{
    @Field(type => ID, {description: "ID de la zona a actualizar"})
    _id: string;

    @Field(type => MapBoundsInput, {nullable: true, description: "Area geografica rectangular que delimita el estado"})
    bounds: MapBoundsInput;
}