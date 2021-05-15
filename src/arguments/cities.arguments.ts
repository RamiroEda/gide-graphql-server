import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CitiesArguments {
    @Field(type => [String], {nullable: true})
    only?: string[];
}