import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject, ReturnModelType } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Filter } from "../arguments/filter.arguments";
import { City } from "../models/city.model";


@InputType()
export class CitiesFilter extends Filter<City> implements Partial<City> {
    @Field(type => [ID], {nullable: true, description: "Obtendra todos los documentos con los IDs especificados"})
    ids?: string[];

    @Field({nullable: true, description: "Ciudades con nombre parecido a la entrada"})
    name?: string;

    @Field(type => ID, {nullable: true, description: "Solo las ciudades dentro del estado especificado"})
    state?: string;

    @Field({nullable: true, description: "Si la ciudad esta activada dentro del sistema."})
    isActive?: boolean;

    filter(ref: QueryWithHelpers<DocumentType<City>[], DocumentType<City>, BeAnObject>): QueryWithHelpers<DocumentType<City>[], DocumentType<City>, BeAnObject>{  
        ref = super.filter(ref);

        if(this.state){
            ref = ref.find({
                state: this.state
            });
        }

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