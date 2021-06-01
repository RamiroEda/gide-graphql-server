import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, ID, InputType } from "type-graphql";
import { BaseModel } from "../models/model";

@InputType()
export abstract class Filter<T extends BaseModel> {
    @Field(type => [ID], {nullable: true, description: "Obtendra todos los documentos con los IDs especificados"})
    ids?: string[];

    filter(ref: QueryWithHelpers<any, any, any>): QueryWithHelpers<DocumentType<T>[], DocumentType<T>, BeAnObject>{  
        if (this.ids) {
            ref = ref.find({
                _id: {
                    $in: this.ids
                }
            });
        }

        return ref;
    }
}