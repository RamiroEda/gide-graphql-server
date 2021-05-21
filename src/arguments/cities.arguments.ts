import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class CitiesArguments {
    @Field(type => [ID], {nullable: true})
    only?: string[];
}