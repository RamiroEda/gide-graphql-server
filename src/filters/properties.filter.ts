import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject, ReturnModelType } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Filter } from "../arguments/filter.arguments";
import { MapBoundsInput } from "../inputs/map_bounds.input";
import { Property } from "../models/property.model";
import { PropertyStatus } from "../models/property_status.model";


@InputType()
export class PropertiesFilter extends Filter<Property> implements Partial<Property> {
    @Field(type => [ID], {nullable: true, description: "Obtendra todos los documentos con los IDs especificados"})
    ids?: string[];

    @Field(type => MapBoundsInput, {nullable: true, description: "Filtra los inmuebles a solo los que se encuentran dentro de un area geografica rectangular"})
    insideMapBounds?: MapBoundsInput;

    @Field(type => ID, {nullable: true, description: "Filtra por estado de la republica"})
    state?: string;

    @Field(type => ID, {nullable: true, description: "Filtra por ciudad dentro del estado"})
    city?: string;

    @Field(type => ID, {nullable: true, description: "Filtra por zona dentro de la ciudad"})
    zone?: string;

    @Field({nullable: true, description: "Filtra por estado de la propiedad"})
    status?: PropertyStatus;

    filter(ref: QueryWithHelpers<DocumentType<Property>[], DocumentType<Property>, BeAnObject>): QueryWithHelpers<DocumentType<Property>[], DocumentType<Property>, BeAnObject>{  
        ref = super.filter(ref);

        if(this.state){
            ref.find({
                state: this.state
            });
        }

        if(this.city){
            ref.find({
                city: this.city
            });
        }

        if(this.zone){
            ref.find({
                zone: this.city
            });
        }

        if(this.insideMapBounds){
            ref = ref.find({
                location: {
                    $geoWithin: {
                        $box: [
                            [ this.insideMapBounds.southWest.latitude, this.insideMapBounds.southWest.longitude ],
                            [ this.insideMapBounds.northEast.latitude, this.insideMapBounds.northEast.longitude ]
                        ]
                    }
                }
            });
        }

        if(this.status){
            ref = ref.find({
                status: this.status
            });
        }

        return ref;
    }
}