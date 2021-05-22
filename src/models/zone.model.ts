import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { City } from "./city.model";
import { MapBounds } from "./map_bounds.model";

@ObjectType({description : "Zona dentro de la ciudad"})
export class Zone {
    @Field(type => ID)
    readonly _id : string;

    @prop({required : true})
    @Field()
    name: string;

    @prop({ ref : 'City' })
    @Field(type => String)
    city?: Ref<City>;

    @prop({required : true})
    @Field(type => MapBounds)
    bounds: MapBounds;

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

export const ZoneModel = getModelForClass(Zone, {
    schemaOptions: {
        timestamps: true
    }
});