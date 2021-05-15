import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class ZonesArguments {
    @Field(type => [String], {nullable: true})
    only?: string[];
}