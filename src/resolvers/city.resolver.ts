import { DocumentType } from "@typegoose/typegoose/lib/types";
import assert from "assert";
import { Arg, Args, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { CitiesArguments } from "../arguments/cities.arguments";
import { CityInput } from "../inputs/city.input";
import { City, CityModel } from "../models/city.model";
import { AuthRole, GideContext } from "../models/context.model";
import { Location, locationToGeoJSON } from "../models/location.model";
import { State, StateModel } from "../models/state.model";
import { Zone } from "../models/zone.model";
import { StateResolver } from "./state.resolver";
import { ZoneResolver } from "./zone.resolver";

@Resolver(City)
export class CityResolver {
    @Query(returns => [City])
    async cities(@Args() { only } : CitiesArguments, @Ctx() context : GideContext) : Promise<City[]>{
        let ref = CityModel.find();

        if(!context.auth){
            ref = ref.find({
                isActive: true
            });
        }

        if(only){
            ref = ref.find({
                _id: {
                    $in: only
                }
            });
        }

        return await ref;
    }

    @Query(returns => City)
    async city(@Arg("cityId") cityId : string) : Promise<City>{
        let ref = CityModel.findById(cityId);

        const doc = await ref;

        assert(doc, "No existe el documento");

        return doc;
    }


    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => City)
    async addCity(@Arg("data") data : CityInput) : Promise<City>{
        const doc = await CityModel.create({
            ...data,
            state: data.stateId,
            location: locationToGeoJSON(data.location)
        });

        if(data.stateId){
            await StateModel.updateOne({
                _id: data.stateId
            },{
                $push: {
                    cities: doc.id
                }
            });
        }

        return doc;
    }

    @FieldResolver(returns => Location)
    location(@Root() city : DocumentType<City>) : Location{
        return {
            latitude: city.location.coordinates[0],
            longitude: city.location.coordinates[1]
        };
    }

    @FieldResolver(returns => State, {nullable: true})
    async state(@Root() city : DocumentType<City>) : Promise<State>{
        if(city.state){
            return new StateResolver().state(city.state.toString());
        }else{
            return null;
        }
    }

    @FieldResolver(returns => [Zone], {nullable: true})
    async zones(@Root() city : DocumentType<City>, @Ctx() context : GideContext) : Promise<Zone[]>{
        return await new ZoneResolver().zones({
            only: city.zones.map<string>((zoneRef) => zoneRef.toString())
        }, context);
    }
}