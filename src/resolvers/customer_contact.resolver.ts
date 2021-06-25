import { DocumentType } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Authorized, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";
import { CustomerContactsArguments } from "../arguments/customer_contacts.arguments";
import { SendContactInformationInput } from "../inputs/send_contact_information.input";
import { AuthRole } from "../models/context.model";
import { CustomerContact, CustomerContactModel } from "../models/customer_contact.model";
import { CustomerStatus } from "../models/customer_status.model";
import { Property } from "../models/property.model";
import { PropertyResolver } from "./property.resolver";
import nodemailer = require("nodemailer");
import smtpTransport = require('nodemailer-smtp-transport');
import { ADMIN_EMAIL, ADMIN_EMAIL_PASSWORD } from "../constants";
import { HTMLParser } from "../email/html_parser";
import { CityResolver } from "./city.resolver";
import { StateResolver } from "./state.resolver";



@Resolver(CustomerContact)
export class CustomerContactResolver {
    @Authorized([AuthRole.ADMIN])
    @Query(returns => [CustomerContact], {description: "Obtiene las solicitudes de contacto registrados en el sistema."})
    async customerContacts(@Args() args: CustomerContactsArguments): Promise<CustomerContact[]> {
        let ref = CustomerContactModel.find().sort({
            createdAt: -1
        });

        if(args.find){
            ref = args.find.filter(ref);
        }

        ref = args.paginate(ref);

        return await ref;
    }

    @Authorized([AuthRole.ADMIN])
    @Query(returns => CustomerContact, {description: "Obtiene la solicitud de contacto por medio de su ID. En caso de no existir tira un error."})
    async customerContact(@Arg("customerContact", type => ID, {description: "ID de la solicitud a buscar"}) customerContact: string): Promise<CustomerContact> {
        const doc = await CustomerContactModel.findById(customerContact);

        assert(doc, "No existe el documento");

        return doc;
    }

    @Mutation(returns => CustomerContact, {description: "Registra una solicitud de contacto en el sistema"})
    async sendContactInformation(@Arg("data", {description: "Información de contacto a ingresar en el sistema."}) data: SendContactInformationInput): Promise<CustomerContact> {
        const transporter = nodemailer.createTransport(smtpTransport({
            service: "gmail",
            host: 'smtp.gmail.com',
            auth: {
                user: ADMIN_EMAIL,
                pass: ADMIN_EMAIL_PASSWORD
            }
        }));

        let address: string;

        if(data.propertyOfInterest){
            const property = await new PropertyResolver().property(data.propertyOfInterest);
            const city = await new CityResolver().city(property.city.toString());
            const state = await new StateResolver().state(property.state.toString());

            address = `${property.address}. C.P. ${property.postalCode}. ${city.name}, ${state.name}.`;
        }

        await transporter.sendMail({
            from: `"GIDE Email Service" <${ADMIN_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: "Nuevas solicitud de contacto | GIDE",
            html: await HTMLParser.parse("./templates/new_contact.template.html", {
                NAME: data.name,
                LASTNAME: data.lastName,
                PHONE: data.phoneNumber,
                EMAIL: data.email,
                PROPERTY: data.propertyOfInterest ? `<a href="https://gide.com.mx/es-MX/properties/${data.propertyOfInterest}">${address}</a>` : "Sin registrar",
            })
        });

        return await CustomerContactModel.create(data);
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => CustomerContact, {description: "Actualiza el estado de la solicitud de contacto"})
    async updateCustomerContactStatus(
        @Arg("customerContact", type => ID, {description: "ID de la solicitud"}) customerContact: string,
        @Arg("status", type => CustomerStatus, {description: "Nuevo estado de la solicitud"}) status: CustomerStatus
    ): Promise<CustomerContact> {
        return await CustomerContactModel.findByIdAndUpdate(customerContact, {
            status
        }, {
            new: true
        });
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