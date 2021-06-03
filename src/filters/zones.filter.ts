import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, ID, InputType } from "type-graphql";
import { Filter } from "./filter";
import { Zone } from "../models/zone.model";


@InputType()
export class ZonesFilter extends Filter<Zone> implements Partial<Zone> {
    @Field(type => [ID], {nullable: true, description: "Obtendra todos los documentos con los IDs especificados"})
    ids?: string[];

    @Field({nullable: true, description: "Zonas con nombre parecido a la entrada"})
    name?: string;

    @Field({nullable: true, description: "Si la zona esta activada dentro del sistema."})
    isActive?: boolean;

    filter(ref: QueryWithHelpers<DocumentType<Zone>[], DocumentType<Zone>, BeAnObject>): QueryWithHelpers<DocumentType<Zone>[], DocumentType<Zone>, BeAnObject>{  
        ref = super.filter(ref);

        if(this.name){
            ref = ref.find({
                name: {
                    $regex: RegExp(`.*(${this.name}).*`, "i")
                }
            });
        }

        if(this.isActive){
            ref = ref.find({
                isActive: this.isActive
            });
        }

        return ref;
    }
}