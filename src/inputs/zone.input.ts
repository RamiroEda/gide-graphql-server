import { Field, ID, InputType } from "type-graphql";
import { Zone } from "../models/zone.model";
import { LocationInput } from "./location.input";

@InputType()
export class ZoneInput implements Omit<Zone, "_id" | "createdAt" | "updatedAt" | "location" | "isActive" | "city">{
    @Field()
    name: string;

    @Field(type => LocationInput)
    location: LocationInput;

    @Field()
    zoom: number;

    @Field(type => ID)
    cityId?: string;
}