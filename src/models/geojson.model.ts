import { prop } from "@typegoose/typegoose";

export class GeoJSONPoint {
    @prop()
    readonly type : string = "Point";

    @prop({type: [Number, Number]})
    coordinates?: [number, number];
}

