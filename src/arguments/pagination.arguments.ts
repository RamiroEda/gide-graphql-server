import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { Max, Min } from "class-validator";
import { QueryWithHelpers } from "mongoose";
import { ArgsType, Field, Int } from "type-graphql";
import { BaseModel } from "../models/model";


@ArgsType()
export class PaginationArguments {
    @Field(type => Int, {description: "Limita el numero de elementos retornados a la cantidad especificada o menos"})
    @Min(1)
    @Max(100)
    limit: number;

    @Field(type => Int, {nullable: true, description: "Salta el numero de elementos especificados"})
    skip?: number;

    paginate<T extends BaseModel>(ref: QueryWithHelpers<DocumentType<T>[], DocumentType<T>, BeAnObject>): QueryWithHelpers<DocumentType<T>[], DocumentType<T>, BeAnObject>{  
        if (this.skip) {
            ref = ref.skip(this.skip); 
        }
        
        if (this.limit) {
            ref = ref.limit(this.limit);
        }

        return ref;
    }
}