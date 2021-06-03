import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, ID, InputType } from "type-graphql";
import { BaseModel } from "../models/model";
import { OrderDirection } from "../models/order_direction.model";

@InputType()
export abstract class Sort<T extends BaseModel> {
    @Field(type => OrderDirection, {nullable: true, description: "Ordena por _id"})
    _id: OrderDirection;

    @Field(type => OrderDirection, {nullable: true, description: "Ordena por createdAt"})
    createdAt: OrderDirection;

    @Field(type => OrderDirection, {nullable: true, description: "Ordena por updatedAt"})
    updatedAt: OrderDirection;

    sort(ref: QueryWithHelpers<any, any, any>): QueryWithHelpers<DocumentType<T>[], DocumentType<T>, BeAnObject>{  
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

        return ref;
    }
}