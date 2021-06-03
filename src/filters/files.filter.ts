import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, ID, InputType } from "type-graphql";
import { Filter } from "../arguments/filter.arguments";
import { File } from "../models/file.model";



@InputType()
export class FilesFilter extends Filter<File> {
    @Field(type => [ID], {nullable: true, description: "Obtendra todos los documentos con los IDs especificados"})
    ids?: string[];

    filter(ref: QueryWithHelpers<DocumentType<File>[], DocumentType<File>, BeAnObject>): QueryWithHelpers<DocumentType<File>[], DocumentType<File>, BeAnObject>{  
        return super.filter(ref);
    }
}