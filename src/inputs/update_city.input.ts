import { Field, ID, InputType } from "type-graphql";
import { MapBoundsInput } from "./map_bounds.input";

@InputType()
export class UpdateCityInput{
    @Field(type => ID, {description: "ID de la ciudad a actualizar"})
    _id: string;

    @Field(type => MapBoundsInput, {nullable: true, description: "Area geografica rectangular que delimita la ciudad"})
    bounds: MapBoundsInput;
}