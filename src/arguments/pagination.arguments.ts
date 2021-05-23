import { ArgsType, Field, Int } from "type-graphql";


@ArgsType()
export class PaginationArguments {
    @Field(type => Int, {nullable: true, description: "Limita el numero de elementos retornados a la cantidad especificada o menos"})
    limit?: number;

    @Field(type => Int, {nullable: true, description: "Salta el numero de elementos especificados"})
    skip?: number;
}