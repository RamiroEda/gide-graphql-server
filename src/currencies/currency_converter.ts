import axios from "axios";
import { AvailableCurrency } from "../models/available_currencies.model";
import { Price } from "../models/price.model";


export class CurrencyConverter {
    private static MXN_USD_EXCHANGE_RATE: {
        rate: number;
        daysSinceEpoch: number;
    };

    private static millisecondsToDays(millis: number): number{
        return Math.floor(millis / 86400000);
    }

    private static async mxnUsdExchangeRate(): Promise<number>{
        const currentDaysSinceEpoch = this.millisecondsToDays(new Date().getTime());

        if(this.MXN_USD_EXCHANGE_RATE && this.MXN_USD_EXCHANGE_RATE.daysSinceEpoch === currentDaysSinceEpoch){
            return this.MXN_USD_EXCHANGE_RATE.rate;
        }else{
            const res = await axios.post("http://www.calculadorasat.com/c", {
                t: "A",
                d: new Date().toISOString()
            });

            this.MXN_USD_EXCHANGE_RATE = {
                rate: res.data.r,
                daysSinceEpoch: currentDaysSinceEpoch
            };

            return this.MXN_USD_EXCHANGE_RATE.rate;
        }
    }

    static async convert(from: Price, to: AvailableCurrency): Promise<Price> {
        switch(from.currency){
            case AvailableCurrency.MXN: {
                return this.fromMXNHandler(from, to);
            }
            case AvailableCurrency.USD: {
                return this.fromUSDHandler(from, to);
            }
        }
    }

    private static async fromMXNHandler(price: Price, to: AvailableCurrency): Promise<Price>{
        switch(to){
            case AvailableCurrency.MXN: {
                return price;
            }
            case AvailableCurrency.USD: {
                return {
                    amount: price.amount / await CurrencyConverter.mxnUsdExchangeRate(),
                    currency: AvailableCurrency.USD
                };
            }
        }
    }

    private static async fromUSDHandler(price: Price, to: AvailableCurrency): Promise<Price>{
        switch(to){
            case AvailableCurrency.MXN: {
                return {
                    amount: price.amount * await CurrencyConverter.mxnUsdExchangeRate(),
                    currency: AvailableCurrency.MXN
                };
            }
            case AvailableCurrency.USD: {
                return price;
            }
        }
    }
}
