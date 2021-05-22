import { ArgsType, Field, Int } from "type-graphql";


@ArgsType()
export class PaginationArguments {
    @Field(type => Int, {nullable: true})
    limit?: number;

    @Field(type => Int, {nullable: true})
    skip?: number;
}