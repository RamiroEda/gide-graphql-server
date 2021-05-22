import { Field, Float, ID, InputType, Int } from "type-graphql";
import { DevelopmentType } from "../models/development_type.model";
import { Property } from "../models/property.model";
import { PropertyType } from "../models/property_type.model";
import { LocationInput } from "./location.input";
import { PriceInput } from "./price.input";

@InputType()
export class PropertyInput implements Omit<Property, "_id" | "location" | "state" | "city" | "zone" | "createdAt" | "updatedAt" | "status">{
    @Field()
    address: string;

    @Field()
    description: string;

    @Field()
    amenities: string;

    @Field(type => ID)
    cityId: string;

    @Field(type => ID)
    stateId: string;

    @Field(type => ID, {nullable: true})
    zoneId?: string;

    @Field(type => LocationInput)
    location: LocationInput;

    @Field()
    postalCode: string;

    @Field(type => PropertyType)
    propertyType: PropertyType;

    @Field(type => Int)
    lotSize: number;

    @Field(type => Int)
    houseSize: number;

    @Field(type => PriceInput)
    price: PriceInput;

    @Field(type => Int)
    roomCount: number;

    @Field(type => Float)
    bathroomCount: number;

    @Field(type => Int)
    parkingSpotCount: number;

    @Field(type => DevelopmentType)
    developmentType: DevelopmentType;

    @Field({nullable : true})
    arePetsAllowed?: boolean;
}