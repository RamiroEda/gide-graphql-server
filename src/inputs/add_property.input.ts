import { GraphQLUpload, FileUpload } from "graphql-upload";
import { Field, Float, ID, InputType, Int } from "type-graphql";
import { Property } from "../models/property.model";
import { PropertyCondition } from "../models/property_condition.model";
import { PropertyType } from "../models/property_type.model";
import { LocationInput } from "./location.input";
import { PriceInput } from "./price.input";

@InputType({description: "Entrada de un nuevo inmueble"})
export class AddPropertyInput implements Omit<Property, "_id" | "location" | "state" | "city" | "zone" | "createdAt" | "pictures" | "updatedAt" | "status"> {
    @Field({description: "Primera linea de la dirección postal del inmueble"})
    address!: string;

    @Field(type => LocationInput, {description: "Precio del inmueble"})
    location!: LocationInput;

    @Field(type => ID, {nullable: true, description: "Identificador de la ciudad a la que pertenece"})
    cityId!: string;

    @Field(type => ID, {nullable: true, description: "Identificador del estado al que pertenece"})
    stateId!: string;

    @Field(type => ID, {nullable: true, description: "Identificador de la zona a la que pertenece"})
    zoneId?: string;

    @Field({description: "Descripcion del inmueble"})
    description: string;

    @Field(type => [String], {description: "Amenidades basicas del inmueble"})
    basicElements: string[];

    @Field(type => [String], {description: "Amenidades del inmueble"})
    amenitiesSet: string[];

    @Field(type => [String], {description: "Servicios cercanos al inmueble del inmueble"})
    areaServices: string[];

    @Field({description: "Codigo postal del inmueble"})
    postalCode!: string;

    @Field(type => PropertyType, {description: "Tipo de inmueble"})
    propertyType!: PropertyType;

    @Field(type => Float, {description: "Area total del lote en metros cuadrados"})
    lotSize!: number;

    @Field(type => Float, {description: "Area total construida dentro del lote en metros cuadrados. Debe ser menor o igual al area del lote."})
    houseSize!: number;

    @Field(type => PriceInput, {description: "Precio de compra del inmueble"})
    price!: PriceInput;

    @Field(type => Int, {description: "Numero de cuartos"})
    roomCount!: number;

    @Field(type => Float, {description: "Numero de baños"})
    bathroomCount!: number;

    @Field(type => Int, {description: "Numero de lugares para estacionar"})
    parkingSpotCount!: number;

    @Field(type => Boolean, {nullable: true, description: "Si estan permitidas las mascotas en la zona residencial. Si es null se considera como desconocido."})
    arePetsAllowed: boolean;

    @Field(type => [GraphQLUpload], {description: "Fotografias del inmueble"})
    propertyPictures: FileUpload[];

    @Field(type => PropertyCondition, {description: "Estado de conservacion del inmueble"})
    propertyCondition: PropertyCondition;
}