import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, Float, ID, ObjectType } from "type-graphql";
import { City } from "./city.model";
import { GeoJSONPoint } from "./geojson.model";

@ObjectType({description: "Estado de la republica"})
export class State {
    @Field(type => ID)
    readonly _id : string;

    @prop()
    @Field()
    name: string;

    @prop()
    location: GeoJSONPoint;

    @prop()
    @Field(type => Float)
    zoom: number;

    @prop({ ref: () => 'City', default: [] })
    @Field(type => [City])
    cities: Ref<City>[];

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

export const StateModel = getModelForClass(State, {
    schemaOptions: {
        timestamps: true
    }
});