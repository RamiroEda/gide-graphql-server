import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { City } from "./city.model";
import { MapBounds } from "./map_bounds.model";

@ObjectType({description : "Zona dentro de una ciudad"})
export class Zone {
    @Field(type => ID, {description: "Identificador de la zona"})
    readonly _id: string;

    @prop({required: true})
    @Field({description: "Nombre de la zona"})
    name: string;

    @prop({ ref : 'City' })
    city?: Ref<City>;

    @prop({required : true})
    @Field(type => MapBounds, {description: "Area geografica rectangular que define las delimitaciones de la zona"})
    bounds: MapBounds;

    @prop({default : false})
    @Field({description: "Si la zona esta activada en el sistema"})
    isActive: boolean;

    @prop()
    @Field({description: "Fecha de adicion del documento"})
    readonly createdAt: Date;

    @prop()
    @Field({description: "Fecha de modificacion del documento"})
    updatedAt: Date;
}

export const ZoneModel = getModelForClass(Zone, {
    schemaOptions: {
        timestamps: true
    }
});