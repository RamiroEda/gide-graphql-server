import { Field, Float, ID, InputType } from "type-graphql";
import { City } from "../models/city.model";
import { LocationInput } from "./location.input";

@InputType()
export class CityInput implements Omit<City, "_id" | "createdAt" | "updatedAt" | "location" | "state" | "zones" | "isActive">{
    @Field()
    name: string;

    @Field(type => LocationInput)
    location: LocationInput;

    @Field(type => Float)
    zoom: number;

    @Field(type => ID, {nullable : true})
    stateId?: string;

    @Field(type => [ID])
    zoneIds: string[];
}