import { GraphQLUpload, FileUpload } from "graphql-upload";
import { Field, Float, ID, InputType, Int } from "type-graphql";
import { DevelopmentType } from "../models/development_type.model";
import { PropertyStatus } from "../models/property_status.model";
import { PropertyType } from "../models/property_type.model";
import { TristateBoolean } from "../models/tristate_boolean";
import { LocationInput } from "./location.input";
import { PriceInput } from "./price.input";

@InputType({description: "Entrada de un nuevo inmueble"})
export class UpdatePropertyInput {
    @Field(type => ID, {description: "ID del inmueble a actualizar"})
    _id: string;

    @Field({description: "Primera linea de la dirección postal del inmueble", nullable: true})
    address?: string;

    @Field(type => LocationInput, {description: "Precio del inmueble", nullable: true})
    location?: LocationInput;

    @Field(type => ID, {nullable: true, description: "Identificador de la ciudad a la que pertenece"})
    cityId?: string;

    @Field(type => ID, {nullable: true, description: "Identificador del estado al que pertenece"})
    stateId?: string;

    @Field(type => ID, {nullable: true, description: "Identificador de la zona a la que pertenece"})
    zoneId?: string;

    @Field({description: "Descripcion del inmueble", nullable: true})
    description?: string;

    @Field({description: "Amenidades del inmueble", nullable: true})
    amenities?: string;

    @Field({description: "Codigo postal del inmueble", nullable: true})
    postalCode?: string;

    @Field(type => PropertyType, {description: "Tipo de inmueble", nullable: true})
    propertyType?: PropertyType;

    @Field(type => Int, {description: "Area total del lote en metros cuadrados", nullable: true})
    lotSize?: number;

    @Field(type => Int, {description: "Area total construida dentro del lote en metros cuadrados. Debe ser menor o igual al area del lote.", nullable: true})
    houseSize?: number;

    @Field(type => PriceInput, {description: "Precio de compra del inmueble", nullable: true})
    price?: PriceInput;

    @Field(type => Int, {description: "Numero de cuartos", nullable: true})
    roomCount?: number;

    @Field(type => Float, {description: "Numero de baños", nullable: true})
    bathroomCount?: number;

    @Field(type => Int, {description: "Numero de lugares para estacionar", nullable: true})
    parkingSpotCount?: number;

    @Field(type => DevelopmentType, {description: "El tipo de desarrollo llevado a cabo en la zona residencial del inmueble", nullable: true})
    developmentType?: DevelopmentType;

    @Field(type => TristateBoolean, {nullable: true, description: "Si estan permitidas las mascotas en la zona residencial. Si es null se considera como desconocido."})
    arePetsAllowed?: TristateBoolean;

    @Field(type => [GraphQLUpload], {description: "Fotografias del inmueble", nullable: true})
    propertyPictures?: FileUpload[];

    @Field(type => PropertyStatus, {nullable: true, description: "El estado de la propiedad"})
    status?: PropertyStatus;
}