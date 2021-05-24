import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { CustomerStatus } from "./customer_status.model";
import { BaseModel } from "./model";
import { Property } from "./property.model";

@ObjectType()
export class CustomerContact implements BaseModel {
    @Field(type => ID, {description: "Identificador de la solicitud de contacto."})
    readonly _id: string;

    @Field({description: "Nombre del cliente"})
    @prop()
    name: string;

    @Field({description: "Apellido del cliente"})
    @prop()
    lastName: string;

    @Field({description: "Correo electronico del cliente"})
    @prop()
    email: string;

    @Field({description: "Numero de telefono del cliente"})
    @prop()
    phoneNumber: string;

    @prop({ ref: Property })
    propertyOfInterest?: Ref<Property>;

    @Field(type => CustomerStatus, {description: "Estado en el que se encuentra la solicitud de contacto"})
    @prop({ enum: CustomerStatus, default: CustomerStatus.PENDING })
    status: CustomerStatus;

    @Field({description: "Fecha de adicion del documento"})
    @prop()
    readonly createdAt: Date;

    @Field({description: "Fecha de modificacion del documento"})
    @prop()
    updatedAt: Date;
}

export const CustomerContactModel = getModelForClass(CustomerContact, {
    schemaOptions: {
        timestamps: true
    }
});