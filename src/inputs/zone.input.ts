import { Field, ID, InputType } from "type-graphql";
import { Zone } from "../models/zone.model";
import { MapBoundsInput } from "./map_bounds.input";

@InputType()
export class ZoneInput implements Omit<Zone, "_id" | "createdAt" | "updatedAt" | "bounds" | "isActive" | "city"> {
    @Field({description: "Nombre de la zona"})
    name: string;

    @Field(type => ID, {nullable: true, description: "Identificador de la ciudad a la que pertenece"})
    cityId?: string;

    @Field(type => MapBoundsInput, {description: "Area geografica rectangular que define las delimitaciones de la zona"})
    bounds: MapBoundsInput;
}