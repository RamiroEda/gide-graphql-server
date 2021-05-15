import { Ref } from "@typegoose/typegoose";
import { Field, ID, InputType } from "type-graphql";
import { City } from "../models/city.model";
import { Zone } from "../models/zone.model";
import { LocationInput } from "./location.input";

@InputType()
export class ZoneInput implements Omit<Zone, "_id" | "createdAt" | "updatedAt" | "location" | "city">{
    @Field()
    name: string;

    @Field(type => LocationInput)
    location: LocationInput;

    @Field()
    zoom: number;

    @Field()
    cityId?: string;
}