import { GraphQLUpload, FileUpload } from "graphql-upload";
import { Field, Float, ID, InputType, Int } from "type-graphql";
import { DevelopmentType } from "../models/development_type.model";
import { Property } from "../models/property.model";
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

    @Field({description: "Amenidades del inmueble"})
    amenities: string;

    @Field({description: "Codigo postal del inmueble"})
    postalCode!: string;

    @Field(type => PropertyType, {description: "Tipo de inmueble"})
    propertyType!: PropertyType;

    @Field(type => Int, {description: "Area total del lote en metros cuadrados"})
    lotSize!: number;

    @Field(type => Int, {description: "Area total construida dentro del lote en metros cuadrados. Debe ser menor o igual al area del lote."})
    houseSize!: number;

    @Field(type => PriceInput, {description: "Precio de compra del inmueble"})
    price!: PriceInput;

    @Field(type => Int, {description: "Numero de cuartos"})
    roomCount!: number;

    @Field(type => Float, {description: "Numero de baños"})
    bathroomCount!: number;

    @Field(type => Int, {description: "Numero de lugares para estacionar"})
    parkingSpotCount!: number;

    @Field(type => DevelopmentType, {description: "El tipo de desarrollo llevado a cabo en la zona residencial del inmueble"})
    developmentType!: DevelopmentType;

    @Field(type => Boolean, {nullable: true, description: "Si estan permitidas las mascotas en la zona residencial. Si es null se considera como desconocido."})
    arePetsAllowed?: boolean;

    @Field(type => [GraphQLUpload], {description: "Imagenes a mostrar en el"})
    propertyPhotos: FileUpload[];
}