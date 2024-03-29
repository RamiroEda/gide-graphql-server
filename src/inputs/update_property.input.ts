import { Field, Float, ID, InputType, Int } from "type-graphql";
import { PropertyCondition } from "../models/property_condition.model";
import { PropertyStatus } from "../models/property_status.model";
import { PropertyType } from "../models/property_type.model";
import { LocationInput } from "./location.input";
import { PriceInput } from "./price.input";
import { UpdateFileInput } from "./update_file.input";

@InputType({description: "Entrada de un nuevo inmueble"})
export class UpdatePropertyInput {
    @Field(type => ID, {description: "ID del inmueble a actualizar"})
    _id: string;

    @Field({description: "Primera linea de la dirección postal del inmueble", nullable: true})
    address?: string;

    @Field(type => LocationInput, {description: "Precio del inmueble", nullable: true})
    location?: LocationInput;

    @Field(type => [String], {description: "Amenidades basicas del inmueble", nullable: true})
    basicElements?: string[];

    @Field(type => [String], {description: "Amenidades del inmueble", nullable: true})
    amenitiesSet?: string[];

    @Field(type => [String], {description: "Servicios cercanos al inmueble del inmueble", nullable: true})
    areaServices?: string[];

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

    @Field(type => Float, {description: "Area total del lote en metros cuadrados", nullable: true})
    lotSize?: number;

    @Field(type => Float, {description: "Area total construida dentro del lote en metros cuadrados. Debe ser menor o igual al area del lote.", nullable: true})
    houseSize?: number;

    @Field(type => PriceInput, {description: "Precio de compra del inmueble", nullable: true})
    price?: PriceInput;

    @Field(type => Int, {description: "Numero de cuartos", nullable: true})
    roomCount?: number;

    @Field(type => Float, {description: "Numero de baños", nullable: true})
    bathroomCount?: number;

    @Field(type => Int, {description: "Numero de lugares para estacionar", nullable: true})
    parkingSpotCount?: number;

    @Field(type => Boolean, {nullable: true, description: "Si estan permitidas las mascotas en la zona residencial. Si es null se considera como desconocido."})
    arePetsAllowed?: boolean;

    @Field(type => [UpdateFileInput], {description: "Fotografias del inmueble", nullable: true})
    propertyPictures?: UpdateFileInput[];

    @Field(type => PropertyStatus, {nullable: true, description: "El estado del inmueble en el sistema de compraventa"})
    status?: PropertyStatus;

    @Field(type => PropertyCondition, {nullable: true, description: "Estado de conservacion del inmueble"})
    propertyCondition?: PropertyCondition;
}