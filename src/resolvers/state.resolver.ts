import { DocumentType } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { StatesArguments } from "../arguments/states.arguments";
import { StateInput } from "../inputs/state.input";
import { City } from "../models/city.model";
import { AuthRole } from "../models/context.model";
import { Location } from "../models/location.model";
import { State, StateModel } from "../models/state.model";
import { CityResolver } from "./city.resolver";

@Resolver(State)
export class StateResolver {
    @Query(returns => [State])
    async states(@Args() { only } : StatesArguments) : Promise<State[]>{
        let ref = StateModel.find();

        if(only){
            ref = ref.find({
                _id: {
                    $in: only
                }
            });
        }

        return await ref;
    }

    @Query(returns => State)
    async state(@Arg("stateId") stateId : string) : Promise<State>{
        let ref = StateModel.findById(stateId);

        const doc = await ref;

        assert(doc, "No existe el documento");

        return doc;
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => State)
    async addState(@Arg("data") data : StateInput) : Promise<State>{
        return await StateModel.create({
            ...data,
            location: {
                type: "Point",
                coordinates: [data.location.latitude, data.location.longitude]
            }
        });
    }

    @FieldResolver(returns => Location)
    location(@Root() state : DocumentType<State>) : Location{
        return {
            latitude: state.location.coordinates[0],
            longitude: state.location.coordinates[1]
        };
    }

    @FieldResolver(returns => [City], {nullable: true})
    async cities(@Root() state : DocumentType<State>) : Promise<City[]>{
        return await new CityResolver().cities({
            only: state.cities.map<string>((cityRef) => cityRef.toString())
        });
    }
}