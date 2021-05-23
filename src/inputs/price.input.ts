import { Field, Float, InputType } from "type-graphql";
import { AvailableCurrency } from "../models/available_currencies.model";
import { Price } from "../models/price.model";

@InputType({ description: "Entrada del precio basado en las monedas disponibles" })
export class PriceInput implements Price {
    @Field(type => Float, { description: "Monto basado en la moneda elegida" })
    amount: number;

    @Field(type => AvailableCurrency, { description: "Moneda disponible en el sistema" })
    currency: AvailableCurrency;
}

