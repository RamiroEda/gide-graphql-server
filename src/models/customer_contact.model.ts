import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { CustomerStatus } from "./customer_status.model";

@ObjectType()
export class CustomerContact {
    @Field(type => ID)
    readonly _id: string;

    @Field()
    @prop()
    name: string;

    @Field()
    @prop()
    lastName: string;

    @Field()
    @prop()
    email: string;

    @Field()
    @prop()
    phoneNumber: string;

    @Field()
    @prop({ enum: CustomerStatus, default: CustomerStatus.PENDING })
    status: CustomerStatus;

    @Field()
    @prop()
    readonly createdAt: Date;

    @Field()
    @prop()
    updatedAt: Date;
}

export const CustomerContactModel = getModelForClass(CustomerContact, {
    schemaOptions: {
        timestamps: true
    }
});