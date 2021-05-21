import { Field, InputType } from "type-graphql";
import { CustomerContact } from "../models/customer_contact.model";


@InputType()
export class SendContactInformationInput implements Partial<CustomerContact>{
    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    lastName: string;

    @Field()
    phoneNumber: string;
}