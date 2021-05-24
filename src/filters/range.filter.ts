import { Field, Float, InputType } from "type-graphql";



@InputType({description: "Rango de filtracion numerica"})
export class Range {
    @Field(type => Float, {description: "Valor minimo inclusivo"})
    minValue: number;

    @Field(type => Float, {description: "Valor maximo inclusivo"})
    maxValue: number;
}