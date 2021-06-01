import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, ID, InputType } from "type-graphql";
import { Filter } from "./filter";
import { CustomerContact } from "../models/customer_contact.model";
import { CustomerStatus } from "../models/customer_status.model";


@InputType()
export class CustomerContactsFilter extends Filter<CustomerContact> implements Partial<CustomerContact>{
    @Field(type => [ID], {nullable: true, description: "Obtendra todos los documentos con los IDs especificados"})
    ids?: string[];

    @Field({nullable: true, description: "Solicitudes de contacto que contienen ese nombre"})
    name?: string;

    @Field({nullable: true, description: "Solicitudes de contacto que contienen ese apellido"})
    lastName?: string;

    @Field({nullable: true, description: "Solicitudes de contacto que contienen ese email"})
    email?: string;

    @Field({nullable: true, description: "Solicitudes de contacto que contienen ese numero de telefono"})
    phoneNumber?: string;

    @Field(type => ID, {nullable: true, description: "Solicitudes de contacto que contienen ese inmueble de interes"})
    propertyOfInterest?: string;

    @Field({nullable: true, description: "Solicitudes de contacto que contienen la entrada en CUALQUIERA de los campos"})
    allFields?: string;

    @Field(type => CustomerStatus, {nullable: true, description: "Estado en el que se encuentra la solicitud de contacto"})
    status?: CustomerStatus;

    filter(ref: QueryWithHelpers<DocumentType<CustomerContact>[], DocumentType<CustomerContact>, BeAnObject>): QueryWithHelpers<DocumentType<CustomerContact>[], DocumentType<CustomerContact>, BeAnObject>{  
        ref = super.filter(ref);

        if(this.allFields){
            ref = ref.find({
                $or: [
                    { name: { $regex: RegExp(`.*(${this.allFields}).*`, "i") } },
                    { lastName: { $regex: RegExp(`.*(${this.allFields}).*`, "i") } },
                    { phoneNumber: { $regex: RegExp(`.*(${this.allFields}).*`, "i") } },
                    { email: { $regex: RegExp(`.*(${this.allFields}).*`, "i") } },
                    { propertyOfInterest: this.allFields }
                ]
            });
        }else{
            if(this.name){
                ref = ref.find({
                    name: {
                        $regex: RegExp(`.*(${this.name}).*`, "i")
                    }
                });
            }
    
            if(this.lastName){
                ref = ref.find({
                    name: {
                        $regex: RegExp(`.*(${this.name}).*`, "i")
                    }
                });
            }
    
            if(this.email){
                ref = ref.find({
                    name: {
                        $regex: RegExp(`.*(${this.name}).*`, "i")
                    }
                });
            }
    
            if(this.phoneNumber){
                ref = ref.find({
                    name: {
                        $regex: RegExp(`.*(${this.name}).*`, "i")
                    }
                });
            }

            if(this.propertyOfInterest){
                ref = ref.find({
                    propertyOfInterest: this.propertyOfInterest
                });
            }

            if(this.status){
                ref = ref.find({
                    status: this.status
                });
            }
        }

        return ref;
    }
}