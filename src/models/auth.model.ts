import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user.model";

@ObjectType()
export class Auth {
    _id: string;

    @prop({required: true, ref: User})
    userId: Ref<User>;

    @prop({ required: true, minlength: 64 })
    @Field()
    accessToken: string;

    @prop({required: true})
    @Field()
    tokenType: string;

    @prop()
    readonly createdAt: Date;

    @prop()
    updatedAt: Date;
}


export const AuthModel = getModelForClass(Auth, {
    schemaOptions: {
        timestamps: true
    }
});