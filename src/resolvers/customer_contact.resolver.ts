import { DocumentType } from "@typegoose/typegoose";
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
        let ref = CustomerContactModel.find();

        if(args.find){
            ref = args.find.filter(ref);
        }

        ref = args.paginate(ref);

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