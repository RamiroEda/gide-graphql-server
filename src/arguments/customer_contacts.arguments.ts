import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class CustomerContactsArguments {
    @Field(type => [ID], {nullable: true})
    only?: string[];

    @Field({nullable: true})
    filterByAnyMatchOf? : string;
}