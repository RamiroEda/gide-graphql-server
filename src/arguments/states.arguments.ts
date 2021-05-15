import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class StatesArguments {
    @Field(type => [String], {nullable: true})
    only?: string[];
}