import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, Float, ID, ObjectType } from "type-graphql";
import { GeoJSONPoint } from "./geojson.model";
import { State } from "./state.model";
import { Zone } from "./zone.model";

@ObjectType({description: "Ciudad dentro de un estado de la republica"})
export class City {
    @Field(type => ID)
    readonly _id : string;

    @prop({required : true})
    @Field()
    name: string;

    @prop({ ref: 'State' })
    state?: Ref<State>;

    @prop({required : true})
    location: GeoJSONPoint;

    @prop({required : true})
    @Field(type => Float)
    zoom: number;

    @prop({required : true, ref: 'Zone'})
    zones: Ref<Zone>[];

    @prop({default : false})
    @Field()
    isActive: boolean;

    @prop()
    @Field()
    readonly createdAt: Date;

    @prop()
    @Field()
    updatedAt: Date;
}

export const CityModel = getModelForClass(City, {
    schemaOptions: {
        timestamps: true
    }
});