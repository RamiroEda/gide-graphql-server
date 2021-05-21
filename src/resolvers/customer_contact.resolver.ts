import assert from "assert";
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CustomerContactsArguments } from "../arguments/customer_contacts.arguments";
import { SendContactInformationInput } from "../inputs/send_contact_information.input";
import { AuthRole } from "../models/context.model";
import { CustomerContact, CustomerContactModel } from "../models/customer_contact.model";



@Resolver(CustomerContact)
export class CustomerContactResolver {
    @Authorized([AuthRole.ADMIN])
    @Query(returns => [CustomerContact])
    async customerContacts(@Args() { only, filterByAnyMatchOf } : CustomerContactsArguments) : Promise<CustomerContact[]>{
        assert(only && filterByAnyMatchOf, "No se puede filtrar por los metadatos y obtener IDs especificos al mismo tiempo. Error: only != null && filter != null.");

        let ref = CustomerContactModel.find();

        if(filterByAnyMatchOf){
            ref = ref.find({
                $or: [
                    { name: { $regex: `.*${filterByAnyMatchOf}.*` } },
                    { lastName: { $regex: `.*${filterByAnyMatchOf}.*` } },
                    { phoneNumber: { $regex: `.*${filterByAnyMatchOf}.*` } },
                    { email: { $regex: `.*${filterByAnyMatchOf}.*` } }
                ]
            });
        }else if(only){
            ref = ref.find({
                _id: {
                    $in: only
                }
            });
        }

        return await ref;
    }

    @Mutation(returns => CustomerContact)
    async sendContactInformation(@Arg("data") data : SendContactInformationInput) : Promise<CustomerContact> {
        return await CustomerContactModel.create(data);
    }
}