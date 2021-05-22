import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { City } from "./city.model";
import { MapBounds } from "./map_bounds.model";

@ObjectType({description: "Estado de la republica"})
export class State {
    @Field(type => ID)
    readonly _id : string;

    @prop()
    @Field()
    name: string;

    @prop({required : true})
    @Field(type => MapBounds)
    bounds: MapBounds;

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