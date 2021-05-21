import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class StatesArguments {
    @Field(type => [ID], {nullable: true})
    only?: string[];
}