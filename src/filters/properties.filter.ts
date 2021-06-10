import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { Field, ID, InputType } from "type-graphql";
import { Filter } from "./filter";
import { CurrencyConverter } from "../currencies/currency_converter";
import { MapBoundsInput } from "../inputs/map_bounds.input";
import { AvailableCurrency, AVAILABLE_CURRECIES } from "../models/available_currencies.model";
import { DevelopmentType } from "../models/development_type.model";
import { Property } from "../models/property.model";
import { PropertyStatus } from "../models/property_status.model";
import { PropertyType } from "../models/property_type.model";
import { PriceRange } from "./price_range.filter";
import { Range } from "./range.filter";


@InputType()
export class PropertiesFilter extends Filter<Property> {
    @Field(type => [ID], {nullable: true, description: "Obtendra todos los documentos con los IDs especificados"})
    ids?: string[];

    @Field(type => MapBoundsInput, {nullable: true, description: "Filtra los inmuebles a solo los que se encuentran dentro de un area geografica rectangular"})
    insideMapBounds?: MapBoundsInput;

    @Field(type => ID, {nullable: true, description: "Filtra por estado de la republica"})
    state?: string;

    @Field(type => ID, {nullable: true, description: "Filtra por ciudad dentro del estado"})
    city?: string;

    @Field(type => ID, {nullable: true, description: "Filtra por zona dentro de la ciudad"})
    zone?: string;

    @Field(type => PropertyStatus, {nullable: true, description: "Filtra por estado de la propiedad"})
    status?: PropertyStatus;

    @Field({nullable: true, description: "Filtra por la disponibilidad de aceptar mascotas"})
    arePetsAllowed?: boolean;

    @Field({nullable: true, description: "Filtra por direcciones parecidas a la entrada"})
    address?: string;

    @Field(type => Range, {nullable: true, description: "Filtra por tamaño del lote"})
    lotSize?: Range;

    @Field(type => Range, {nullable: true, description: "Filtra por tamaño del terreno contruido"})
    houseSize?: Range;

    @Field(type => Range, {nullable: true, description: "Filtra por el numero de baños"})
    bathroomCount?: Range;

    @Field(type => Range, {nullable: true, description: "Filtra por el numero de cuartos"})
    roomCount?: Range;

    @Field(type => Range, {nullable: true, description: "Filtra por el numero de espacios para estacionar"})
    parkingSpotCount?: Range;

    @Field(type => DevelopmentType, {nullable: true, description: "Filtra por el tipo de desarrollo inmobiliario del lugar"})
    developmentType?: DevelopmentType;

    @Field(type => PropertyType, {nullable: true, description: "Filtra por el tipo de propiedad"})
    propertyType?: PropertyType;

    @Field(type => PriceRange, {nullable: true, description: "Filtra por el precio del inmueble"})
    price?: PriceRange;

    async customFilter(ref: QueryWithHelpers<DocumentType<Property>[], DocumentType<Property>, BeAnObject>, expectedReturnCurrency: AvailableCurrency): Promise<{ ref: QueryWithHelpers<DocumentType<Property>[], DocumentType<Property>, BeAnObject> }>{
        ref = this.filter(ref);

        if(this.price){
            const ranges = await Promise.all(
                AVAILABLE_CURRECIES.map<Promise<PriceRange>>(async (key) => {
                    return {
                        maxPrice: (await CurrencyConverter.convert({
                            amount: this.price.maxPrice,
                            currency: this.price.currency
                        }, AvailableCurrency[key])).amount,
                        minPrice: (await CurrencyConverter.convert({
                            amount: this.price.minPrice,
                            currency: this.price.currency
                        }, AvailableCurrency[key])).amount,
                        currency: AvailableCurrency[key]
                    }
                })
            );

            ref = ref.find({
                $or: ranges.map((range) => {
                    return {
                        "price.currency": range.currency,
                        "price.amount": {
                            $lte: range.maxPrice,
                            $gte: range.minPrice
                        }
                    }
                })
            });
        }

        return {
            ref
        };
    }

    filter(ref: QueryWithHelpers<DocumentType<Property>[], DocumentType<Property>, BeAnObject>): QueryWithHelpers<DocumentType<Property>[], DocumentType<Property>, BeAnObject>{  
        ref = super.filter(ref);

        if(this.state){
            ref = ref.find({
                state: this.state
            });
        }

        if(this.city){
            ref = ref.find({
                city: this.city
            });
        }

        if(this.zone){
            ref = ref.find({
                zone: this.city
            });
        }

        if(this.arePetsAllowed !== undefined){
            ref = ref.find({
                arePetsAllowed: this.arePetsAllowed
            });
        }

        if(this.address){
            ref = ref.find({
                address: {
                    $regex: RegExp(`.*${this.address}.*`, "i")
                }
            });
        }

        if(this.lotSize){
            ref = ref.find({
                lotSize: {
                    $gte: this.lotSize.minValue,
                    $lte: this.lotSize.maxValue
                }
            });
        }

        if(this.houseSize){
            ref = ref.find({
                houseSize: {
                    $gte: this.houseSize.minValue,
                    $lte: this.houseSize.maxValue
                }
            });
        }

        if(this.bathroomCount){
            ref = ref.find({
                bathroomCount: {
                    $gte: this.bathroomCount.minValue,
                    $lte: this.bathroomCount.maxValue
                }
            });
        }

        if(this.roomCount){
            ref = ref.find({
                roomCount: {
                    $gte: this.roomCount.minValue,
                    $lte: this.roomCount.maxValue
                }
            });
        }

        if(this.parkingSpotCount){
            ref = ref.find({
                parkingSpotCount: {
                    $gte: this.parkingSpotCount.minValue,
                    $lte: this.parkingSpotCount.maxValue
                }
            });
        }

        if(this.developmentType){
            ref = ref.find({
                developmentType: this.developmentType
            });
        }

        if(this.propertyType){
            ref = ref.find({
                propertyType: this.propertyType
            });
        }

        if(this.insideMapBounds){
            ref = ref.find({
                location: {
                    $geoWithin: {
                        $box: [
                            [ this.insideMapBounds.southWest.latitude, this.insideMapBounds.southWest.longitude ],
                            [ this.insideMapBounds.northEast.latitude, this.insideMapBounds.northEast.longitude ]
                        ]
                    }
                }
            });
        }

        if(this.status){
            ref = ref.find({
                status: this.status
            });
        }

        return ref;
    }
}