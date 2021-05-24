import { Field, Float, InputType } from "type-graphql";
import { AvailableCurrency } from "../models/available_currencies.model";



@InputType({description: "Rango de filtracion numerica"})
export class PriceRange {
    @Field(type => Float, {description: "Precio minimo inclusivo"})
    minPrice: number;

    @Field(type => Float, {description: "Precio maximo inclusivo"})
    maxPrice: number;

    @Field(type => AvailableCurrency, {description: "Moneda para hacer la busqueda"})
    currency: AvailableCurrency;
}