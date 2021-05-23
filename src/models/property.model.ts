import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { City } from "./city.model";
import { DevelopmentType } from "./development_type.model";
import { GeoJSONPoint } from "./geojson.model";
import { Price } from "./price.model";
import { PropertyStatus } from "./property_status.model";
import { PropertyType } from "./property_type.model";
import { State } from "./state.model";
import { Zone } from "./zone.model";

@ObjectType({
    description: "Inmueble dentro del sistema de compraventa. Este inmueble contiene los objetos de Ciudad, Estado y Zona."
})
export class Property {
    @Field(type => ID, {description: "Identificador del inmueble"})
    readonly _id!: string;

    @prop()
    @Field({description: "Primera linea de la dirección postal del inmueble"})
    address!: string;

    @prop()
    @Field({description: "Descripcion del inmueble"})
    description: string;

    @prop()
    @Field({description: "Amenidades del inmueble"})
    amenities: string;

    @prop({ ref: () => City })
    city!: Ref<City>;

    @prop({ ref: () => State  })
    state!: Ref<State>;

    @prop({ ref: () => Zone })
    zone?: Ref<Zone>;

    @prop()
    @Field({description: "Codigo postal del inmueble"})
    postalCode!: string;

    @prop({ enum: PropertyType })
    @Field({description: "Tipo de inmueble"})
    propertyType!: PropertyType;

    @prop()
    @Field(type => Int, {description: "Area total del lote en metros cuadrados"})
    lotSize!: number;

    @prop()
    @Field(type => Int, {description: "Area total construida dentro del lote en metros cuadrados. Debe ser menor o igual al area del lote."})
    houseSize!: number;

    @prop({ type: Price })
    @Field(type => Price, {description: "Precio de compra del inmueble"})
    price!: Price;

    @prop()
    @Field(type => Int, {description: "Numero de cuartos"})
    roomCount!: number;

    @prop()
    @Field(type => Float, {description: "Numero de baños"})
    bathroomCount!: number;

    @prop()
    @Field(type => Int, {description: "Numero de lugares para estacionar"})
    parkingSpotCount!: number;

    @prop({ enum: DevelopmentType })
    @Field({description: "El tipo de desarrollo llevado a cabo en la zona residencial del inmueble"})
    developmentType!: DevelopmentType;

    @prop()
    @Field({description: "Si estan permitidas las mascotas en la zona residencial. Si es null se considera como desconocido."})
    arePetsAllowed?: boolean;

    @prop()
    location!: GeoJSONPoint;

    @prop({ enum: PropertyStatus })
    @Field({description: "Estado del inmueble en el sistema de compraventa"})
    status!: PropertyStatus;

    @prop()
    @Field({description: "Fecha de la creacion del documento"})
    readonly createdAt!: Date;

    @prop()
    @Field({description: "Fecha de la modificacion del documento"})
    updatedAt!: Date;
}


export const PropertyModel = getModelForClass(Property, {
    schemaOptions: {
        timestamps: true
    }
})