import { Field, ID, InputType } from "type-graphql";
import { State } from "../models/state.model";
import { LocationInput } from "./location.input";

@InputType()
export class StateInput implements Omit<State, "_id" | "createdAt" | "updatedAt" | "cities" | "location" | "isActive">{
    @Field()
    name: string;

    @Field(type => LocationInput)
    location: LocationInput;

    @Field()
    zoom: number;

    @Field(type => [ID], {nullable: true})
    cities?: string[];
}