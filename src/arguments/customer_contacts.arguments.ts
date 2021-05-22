import { ArgsType, Field, ID, Int } from "type-graphql";
import { PaginationArguments } from "./pagination.arguments";

@ArgsType()
export class CustomerContactsArguments implements PaginationArguments {
    @Field(type => [ID], {nullable: true})
    only?: string[];

    @Field({nullable: true})
    filterByAnyMatchOf? : string;

    @Field(type => Int, {nullable: true})
    limit?: number;

    @Field(type => Int, {nullable: true})
    skip?: number;
}