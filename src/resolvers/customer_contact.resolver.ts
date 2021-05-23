import { DocumentType } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { CustomerContactsArguments } from "../arguments/customer_contacts.arguments";
import { SendContactInformationInput } from "../inputs/send_contact_information.input";
import { AuthRole } from "../models/context.model";
import { CustomerContact, CustomerContactModel } from "../models/customer_contact.model";
import { Property } from "../models/property.model";
import { PropertyResolver } from "./property.resolver";



@Resolver(CustomerContact)
export class CustomerContactResolver {
    @Authorized([AuthRole.ADMIN])
    @Query(returns => [CustomerContact], {description: "Obtiene las solicitudes de contacto registrados en el sistema."})
    async customerContacts(@Args() args: CustomerContactsArguments): Promise<CustomerContact[]> {
        assert(args.only && args.filterByAnyMatchOf, "No se puede filtrar por los metadatos y obtener IDs especificos al mismo tiempo. Error: only != null && filter != null.");

        let ref = CustomerContactModel.find();

        if (args.filterByAnyMatchOf) {
            ref = ref.find({
                $or: [
                    { name: { $regex: `.*${args.filterByAnyMatchOf}.*` } },
                    { lastName: { $regex: `.*${args.filterByAnyMatchOf}.*` } },
                    { phoneNumber: { $regex: `.*${args.filterByAnyMatchOf}.*` } },
                    { email: { $regex: `.*${args.filterByAnyMatchOf}.*` } }
                ]
            });
        } else if (args.only) {
            ref = ref.find({
                _id: {
                    $in: args.only
                }
            });
        }

        if (args.skip) {
            ref = ref.skip(args.skip);
        }
        
        if (args.limit) {
            ref = ref.limit(args.limit);
        }

        return await ref;
    }

    @Mutation(returns => CustomerContact, {description: "Registra una solicitud de contacto en el sistema"})
    async sendContactInformation(@Arg("data", {description: "Información de contacto a ingresar en el sistema."}) data: SendContactInformationInput): Promise<CustomerContact> {
        return await CustomerContactModel.create(data);
    }

    @FieldResolver(returns => Property, {nullable: true, description: "Propiedad en la que se encuentra interesado el cliente"})
    async propertyOfInterest(@Root() customerContact: DocumentType<CustomerContact>): Promise<Property>{
        if(customerContact.propertyOfInterest){
            return new PropertyResolver().property(customerContact.propertyOfInterest.toString());
        }else{
            return null;
        }
    }
}