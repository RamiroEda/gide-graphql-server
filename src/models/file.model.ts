import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { BaseModel } from "./model";


@ObjectType()
export class File implements BaseModel{
    readonly _id: string;

    @Field()
    @prop()
    url: string;

    @Field()
    @prop()
    mimeType: string;

    @Field()
    @prop()
    fileName: string;

    @Field()
    @prop()
    encoding: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}


export const FileModel = getModelForClass(File, {
    schemaOptions: {
        timestamps: true
    }
});