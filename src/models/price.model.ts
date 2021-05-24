import { prop } from "@typegoose/typegoose";
import { Field, Float, InputType, ObjectType } from "type-graphql";
import { AvailableCurrency } from "./available_currencies.model";

@ObjectType({ description: "Precio en moneda disponible" })
export class Price {
    @Field(type => Float, { description: "Monto basado en la moneda elegida" })
    @prop({required: true})
    amount: number;

    @prop({ enum: AvailableCurrency, required: true })
    @Field(type => AvailableCurrency, { description: "Moneda disponible en el sistema" })
    currency: AvailableCurrency;
}

