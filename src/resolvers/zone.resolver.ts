import assert from "assert";
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ZonesArguments } from "../arguments/zones.arguments";
import { ZoneInput } from "../inputs/zone.input";
import { CityModel } from "../models/city.model";
import { AuthRole, GideContext } from "../models/context.model";
import { Zone, ZoneModel } from "../models/zone.model";

@Resolver(Zone)
export class ZoneResolver {
    @Query(returns => [Zone])
    async zones(@Args() args : ZonesArguments, @Ctx() context : GideContext) : Promise<Zone[]>{
        let ref = ZoneModel.find();

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

    @Query(returns => Zone)
    async zone(@Arg("zoneId") zoneId : string) : Promise<Zone>{
        let ref = ZoneModel.findById(zoneId);

        const doc = await ref;

        assert(doc, "No existe el documento");

        return doc;
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Zone)
    async addZone(@Arg("data") data : ZoneInput) : Promise<Zone>{
        const doc = await ZoneModel.create(data);

        if(data.cityId){
            await CityModel.updateOne({
                _id: data.cityId
            },{
                $push: {
                    zones: doc._id.toString()
                }
            });
        }

        return doc;
    }
}