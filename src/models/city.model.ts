import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { MapBounds } from "./map_bounds.model";
import { BaseModel } from "./model";
import { State } from "./state.model";
import { Zone } from "./zone.model";

@ObjectType({description: "Ciudad dentro de un estado de la republica"})
export class City extends BaseModel {
    @Field(type => ID, {description: "Identificador de la ciudad"})
    readonly _id: string;

    @prop({required : true})
    @Field({description: "Nombre del estado"})
    name: string;

    @prop({ ref: "State" })
    state?: Ref<State>;

    @prop({required : true, type: MapBounds })
    @Field(type => MapBounds, {description: "Area geografica en forma rectangular que delimita al estado"})
    bounds: MapBounds;

    @prop({required : true, ref: "Zone"})
    zones: Ref<Zone>[];

    @prop({default : false})
    @Field({description: "Si el estado esta activado dentro del sistema."})
    isActive: boolean;

    @Field({description: "Fecha de adicion del documento"})
    readonly createdAt: Date;

    @Field({description: "Fecha de modificacion del documento"})
    updatedAt: Date;
}

export const CityModel = getModelForClass(City, {
    schemaOptions: {
        timestamps: true
    }
});