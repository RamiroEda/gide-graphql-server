import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, ID, InputType } from "type-graphql";
import { Filter } from "../arguments/filter.arguments";
import { State } from "../models/state.model";


@InputType()
export class StatesFilter extends Filter<State> implements Partial<State> {
    @Field(type => [ID], {nullable: true, description: "Obtendra todos los documentos con los IDs especificados"})
    ids?: string[];

    @Field({nullable: true, description: "Estados con nombre parecido a la entrada"})
    name?: string;

    @Field({nullable: true, description: "Si el estado esta activada dentro del sistema."})
    isActive?: boolean;

    filter(ref: QueryWithHelpers<DocumentType<State>[], DocumentType<State>, BeAnObject>): QueryWithHelpers<DocumentType<State>[], DocumentType<State>, BeAnObject>{  
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