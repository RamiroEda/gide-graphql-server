import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { AuthRole } from "./context.model";
import { BaseModel } from "./model";

@ObjectType({description: "Usuario registrado dentro del sistema"})
export class User implements BaseModel {
    @Field(type => ID, {description: "ID del usuario"})
    readonly _id: string;

    @Field({description: "Nombre de usuario"})
    @prop({required: true})
    username: string;

    @Field({description: "Nombre del usuario"})
    @prop({required: true})
    name: string;

    @Field({nullable: true, description: "Apellido del usuario"})
    @prop({required: false})
    lastName?: string;

    @Field(type => AuthRole, {description: "Rol dentro del sistema"})
    @prop({ enum: AuthRole })
    role: AuthRole;

    @prop()
    password?: string;

    readonly createdAt: Date;

    updatedAt: Date;
}


export const UserModel = getModelForClass(User, {
    schemaOptions: {
        timestamps: true
    }
});