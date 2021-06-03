import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, InputType } from "type-graphql";
import { OrderDirection } from "../models/order_direction.model";
import { Property } from "../models/property.model";
import { Sort } from "./sort";


@InputType()
export class PropertiesSort extends Sort<Property> {
    @Field(type => OrderDirection, {nullable: true, description: "Ordena por _id"})
    _id: OrderDirection;

    @Field(type => OrderDirection, {nullable: true, description: "Ordena por createdAt"})
    createdAt: OrderDirection;

    @Field(type => OrderDirection, {nullable: true, description: "Ordena por updatedAt"})
    updatedAt: OrderDirection;

    @Field(type => OrderDirection, {nullable: true, description: "Ordena por address"})
    address: OrderDirection;

    @Field(type => OrderDirection, {nullable: true, description: "Ordena por price"})
    price: OrderDirection;

    @Field(type => OrderDirection, {nullable: true, description: "Ordena por status"})
    status: OrderDirection;
    

    sort(ref: QueryWithHelpers<DocumentType<Property>[], DocumentType<Property>, BeAnObject>): QueryWithHelpers<DocumentType<Property>[], DocumentType<Property>, BeAnObject>{  
        if (this._id) {
            ref = ref.sort({
                _id: this._id
            });
        }

        if (this.createdAt) {
            ref = ref.sort({
                createdAt: this.createdAt
            });
        }

        if (this.updatedAt) {
            ref = ref.sort({
                updatedAt: this.updatedAt
            });
        }

        if (this.address) {
            ref = ref.sort({
                address: this.address
            });
        }

        if (this.price) {
            ref = ref.sort({
                price: this.price
            });
        }

        if (this.status) {
            ref = ref.sort({
                status: this.status
            });
        }

        return ref;
    }
};