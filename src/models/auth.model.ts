import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user.model";

@ObjectType({description: "Objeto de relacion entre usuario y sesion"})
export class Auth {
    _id: string;

    @prop({required: true, ref: User})
    userId: Ref<User>;

    @prop({ required: true, minlength: 64 })
    @Field({description: "Access Token de la sesion del usuario."})
    accessToken: string;

    @prop({required: true})
    @Field({description: "Tipo de token. ej 'Bearer'"})
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