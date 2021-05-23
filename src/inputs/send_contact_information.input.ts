import { Field, ID, InputType } from "type-graphql";
import { CustomerContact } from "../models/customer_contact.model";


@InputType()
export class SendContactInformationInput implements Partial<CustomerContact> {
    @Field({description: "Nombre del cliente"})
    name: string;

    @Field({description: "Apellido del cliente"})
    lastName: string;

    @Field({description: "Correo electronico del cliente"})
    email: string;

    @Field({description: "Numero de telefono del cliente"})
    phoneNumber: string;

    @Field(type => ID, {nullable: true, description: "Identificador de la propiedad de interes"})
    propertyOfInterest?: string;
}