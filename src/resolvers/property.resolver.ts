import { DocumentType } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { PropertiesArguments } from "../arguments/properties.arguments";
import { PropertyInput } from "../inputs/property.input";
import { City, CityModel } from "../models/city.model";
import { AuthRole, GideContext } from "../models/context.model";
import { Location, locationToGeoJSON } from "../models/location.model";
import { Property, PropertyModel } from "../models/property.model";
import { PropertyStatus } from "../models/property_status.model";
import { State, StateModel } from "../models/state.model";
import { Zone } from "../models/zone.model";
import { CityResolver } from "./city.resolver";
import { StateResolver } from "./state.resolver";
import { ZoneResolver } from "./zone.resolver";

@Resolver(Property)
export class PropertyResolver {
    @Query(returns => [Property])
    async properties(@Args() args : PropertiesArguments, @Ctx() context : GideContext) : Promise<Property[]> {
        let ref = PropertyModel.find();

        if(!context.auth){
            ref = ref.find({
                status: PropertyStatus.AVAILABLE
            });
        }

        if(args.filterByStateId){
            ref = ref.find({
                state: args.filterByStateId
            });
        }

        if(args.filterByCityId){
            ref = ref.find({
                city: args.filterByCityId
            });
        }

        if(args.filterByZoneId){
            ref = ref.find({
                zone: args.filterByZoneId
            });
        }

        if(args.only){
            ref = ref.find({
                _id: {
                    $in: args.only
                }
            });
        }

        if(args.inMapBounds){
            ref = ref.find({
                location: {
                    $geoWithin: {
                        $box: [
                            [ args.inMapBounds.southWest.latitude, args.inMapBounds.southWest.longitude ],
                            [ args.inMapBounds.northEast.latitude, args.inMapBounds.northEast.longitude ]
                        ]
                    }
                }
            });
        }
        
        if(args.skip){
            ref = ref.skip(args.skip);
        }
        
        if(args.limit){
            ref = ref.limit(args.limit);
        }

        return await ref;
    }

    @Query(returns => Property)
    async property(@Arg("propertyId") propertyId : string) : Promise<Property>{
        let ref = PropertyModel.findById(propertyId);

        const doc = await ref;

        assert(doc, "No existe el documento");

        return doc;
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Property)
    async addProperty(@Arg("data") data : PropertyInput) : Promise<Property>{
        assert(data.houseSize <= data.lotSize, "El area construida debe ser menor o igual al area del lote.");

        const stateDocument = await StateModel.findById(data.stateId);

        assert(stateDocument, "El identificador del Estado no existe.");
        assert(stateDocument.cities.includes(data.cityId), "La Ciudad seleccionada no se encuentra dentro del Estado.")

        const cityDocument = await CityModel.findById(data.cityId);

        assert(cityDocument, "El identificador de la Ciudad no existe.");
        if(data.zoneId){
            assert(cityDocument.zones.includes(data.zoneId), "La Zona seleccionada no se encuentra dentro de la Ciudad.")
        }


        return await PropertyModel.create({
            ...data,
            city: data.cityId,
            state: data.stateId,
            zone: data.zoneId,
            status: PropertyStatus.AVAILABLE,
            location: locationToGeoJSON(data.location)
        });
    }

    @FieldResolver(returns => Location)
    location(@Root() property : DocumentType<Property>) : Location{
        return {
            latitude: property.location.coordinates[0],
            longitude: property.location.coordinates[1]
        };
    }

    @FieldResolver(returns => State)
    async state(@Root() property : DocumentType<Property>) : Promise<State>{
        return new StateResolver().state(property.state.toString());
    }

    @FieldResolver(returns => City)
    async city(@Root() property : DocumentType<Property>) : Promise<City>{
        return new CityResolver().city(property.city.toString());
    }

    @FieldResolver(returns => Zone)
    async zone(@Root() property : DocumentType<Property>) : Promise<Zone>{
        return new ZoneResolver().zone(property.zone.toString());
    }
}