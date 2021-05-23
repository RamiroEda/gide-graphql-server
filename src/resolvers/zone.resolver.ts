import { DocumentType } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { ZonesArguments } from "../arguments/zones.arguments";
import { ZoneInput } from "../inputs/zone.input";
import { City, CityModel } from "../models/city.model";
import { AuthRole, GideContext } from "../models/context.model";
import { Zone, ZoneModel } from "../models/zone.model";
import { CityResolver } from "./city.resolver";

@Resolver(Zone)
export class ZoneResolver {
    @Query(returns => [Zone], {description: "Obtiene todas las zonas dentro de ciudades. Si se ha iniciado sesion debolvera todas las zonas, sino, devolvera las zonas activadas."})
    async zones(@Args() args: ZonesArguments, @Ctx() context: GideContext): Promise<Zone[]> {
        let ref = ZoneModel.find();

        if(!context.auth) {
            ref = ref.find({
                isActive: true
            });
        }

        if(args.only) {
            ref = ref.find({
                _id: {
                    $in: args.only
                }
            });
        }

        if(args.skip) {
            ref = ref.skip(args.skip);
        }
        
        if(args.limit) {
            ref = ref.limit(args.limit);
        }

        return await ref;
    }

    @Query(returns => Zone, {description: "Obtiene una zona por medio de su ID."})
    async zone(@Arg("zoneId", {description: "ID de la zona a obtener"}) zoneId: string): Promise<Zone> {
        let ref = ZoneModel.findById(zoneId);

        const doc = await ref;

        assert(doc, "No existe el documento");

        return doc;
    }

    @FieldResolver(returns => City, {description: "Ciudad donde se encuentra la zona"})
    async city(@Root() zone: DocumentType<Zone>): Promise<City> {
        if (zone.city) {
            return new CityResolver().city(zone.city.toString());
        } else {
            return null;
        }
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Zone, {description: "Añade una zona dentro de una ciudad al sistema. Admin role required."})
    async addZone(@Arg("data") data: ZoneInput): Promise<Zone> {
        const doc = await ZoneModel.create(data);

        if(data.cityId) {
            await CityModel.updateOne({
                _id: data.cityId
            }, {
                $push: {
                    zones: doc._id.toString()
                }
            });
        }

        return doc;
    }
}