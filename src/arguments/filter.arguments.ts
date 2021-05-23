import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class FilterArguments {
    @Field(type => [ID], {nullable: true, description: "Va a devolver unicamente los IDs especificados"})
    only?: string[];
}