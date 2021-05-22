import assert from "assert";
import { Arg, Args, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { CustomerContactsArguments } from "../arguments/customer_contacts.arguments";
import { SendContactInformationInput } from "../inputs/send_contact_information.input";
import { AuthRole } from "../models/context.model";
import { CustomerContact, CustomerContactModel } from "../models/customer_contact.model";



@Resolver(CustomerContact)
export class CustomerContactResolver {
    @Authorized([AuthRole.ADMIN])
    @Query(returns => [CustomerContact])
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

    @Mutation(returns => CustomerContact)
    async sendContactInformation(@Arg("data") data: SendContactInformationInput): Promise<CustomerContact> {
        return await CustomerContactModel.create(data);
    }
}