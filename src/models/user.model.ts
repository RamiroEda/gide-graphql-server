import { getModelForClass, prop } from "@typegoose/typegoose";
import { AuthRole } from "./context.model";
import { BaseModel } from "./model";


export class User implements BaseModel {
    readonly _id: string;

    @prop({required: true})
    username: string;

    @prop({required: true})
    name: string;

    @prop({ enum: AuthRole })
    role: AuthRole;

    @prop()
    password?: string;

    @prop()
    readonly createdAt: Date;

    @prop()
    updatedAt: Date;
}


export const UserModel = getModelForClass(User, {
    schemaOptions: {
        timestamps: true
    }
});