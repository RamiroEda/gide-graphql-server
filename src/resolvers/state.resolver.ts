import { DocumentType } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { PaginationArguments } from "../arguments/pagination.arguments";
import { StatesArguments } from "../arguments/states.arguments";
import { City } from "../models/city.model";
import { GideContext } from "../models/context.model";
import { State, StateModel } from "../models/state.model";
import { CityResolver } from "./city.resolver";

@Resolver(State)
export class StateResolver {
    @Query(returns => [State])
    async states(@Args() args: StatesArguments, @Ctx() context: GideContext): Promise<State[]>{
        let ref = StateModel.find();

        if(!context.auth){
            ref = ref.find({
                isActive: true
            });
        }

        if(args.only){
            ref = ref.find({
                _id: {
                    $in: args.only
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

    @Query(returns => State)
    async state(@Arg("stateId") stateId: string): Promise<State>{
        let ref = StateModel.findById(stateId);

        const doc = await ref;

        assert(doc, "No existe el documento");

        return doc;
    }

    @FieldResolver(returns => [City], {nullable: true})
    async cities(@Root() state: DocumentType<State>, @Args() args: PaginationArguments, @Ctx() context: GideContext): Promise<City[]>{
        return await new CityResolver().cities({
            only: state.cities.map<string>((cityRef) => cityRef.toString()),
            ...args
        }, context);
    }
}