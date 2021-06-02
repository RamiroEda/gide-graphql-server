import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { AuthRole } from "./context.model";
import { BaseModel } from "./model";

@ObjectType()
export class User implements BaseModel {
    @Field()
    readonly _id: string;

    @Field()
    @prop({required: true})
    username: string;

    @Field()
    @prop({required: true})
    name: string;

    @Field({nullable: true})
    @prop({required: false})
    lastName?: string;

    @Field(type => AuthRole)
    @prop({ enum: AuthRole })
    role: AuthRole;

    @prop()
    password?: string;

    @Field()
    @prop()
    readonly createdAt: Date;

    @Field()
    @prop()
    updatedAt: Date;
}


export const UserModel = getModelForClass(User, {
    schemaOptions: {
        timestamps: true
    }
});