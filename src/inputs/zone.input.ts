import { Field, ID, InputType } from "type-graphql";
import { Zone } from "../models/zone.model";
import { LocationInput } from "./location.input";
import { MapBoundsInput } from "./map_bounds.input";

@InputType()
export class ZoneInput implements Omit<Zone, "_id" | "createdAt" | "updatedAt" | "bounds" | "isActive" | "city">{
    @Field()
    name: string;

    @Field(type => LocationInput)
    location: LocationInput;

    @Field(type => MapBoundsInput)
    bounds: MapBoundsInput;

    @Field()
    zoom: number;

    @Field(type => ID)
    cityId?: string;
}