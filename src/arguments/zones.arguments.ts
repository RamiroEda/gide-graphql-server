import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class ZonesArguments {
    @Field(type => [ID], {nullable: true})
    only?: string[];
}