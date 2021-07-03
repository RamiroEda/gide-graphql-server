import { DocumentType } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";
import { ZonesArguments } from "../arguments/zones.arguments";
import { AddZoneInput } from "../inputs/add_zone.input";
import { UpdateZoneInput } from "../inputs/update_zone.input";
import { City, CityModel } from "../models/city.model";
import { AuthRole, GideContext } from "../models/context.model";
import { Zone, ZoneModel } from "../models/zone.model";
import { CityResolver } from "./city.resolver";

@Resolver(Zone)
export class ZoneResolver {
    @Query(returns => [Zone], {description: "Obtiene todas las zonas dentro de ciudades. Si se ha iniciado sesion debolvera todas las zonas, sino, devolvera las zonas activadas."})
    async zones(@Args() args: ZonesArguments, @Ctx() context: GideContext): Promise<Zone[]> {
        let ref = ZoneModel.find();

        if(args.find){
            ref = args.find.filter(ref);
        }

        if(!context.auth) {
            ref = ref.find({
                isActive: true
            });
        }

        ref = args.paginate(ref);

        return await ref;
    }

    @Query(returns => Zone, {description: "Obtiene una zona por medio de su ID."})
    async zone(@Arg("zone", {description: "ID de la zona a obtener"}) zone: string): Promise<Zone> {
        const doc = await ZoneModel.findById(zone);

        assert(doc, "No existe el documento");

        return doc;
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Zone, {description: "Cambia el estado de activacion de la zona al valor opuesto."})
    async toggleZoneActivation(@Arg("zone", type => ID, {description: "ID de la ciudad a actualizar"}) zone: string): Promise<Zone>{
        const doc = await ZoneModel.findById(zone);

        assert(doc, "No existe el documento");

        doc.isActive = !doc.isActive;

        return (await doc.save() as DocumentType<Zone>);
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Zone, {description: "Cambia el estado de activacion de la zona al valor opuesto."})
    async updateZone(@Arg("data") args: UpdateZoneInput): Promise<Zone>{
        const doc = await ZoneModel.findById(args._id);

        assert(doc, "No existe el documento");

        if(args.name){
            doc.name = args.name;
        }

        if(args.bounds){
            doc.bounds = args.bounds;
        }

        return (await doc.save() as DocumentType<Zone>);
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
    async addZone(@Arg("data") data: AddZoneInput): Promise<Zone> {
        const doc = await ZoneModel.create(data);

        if(data.city) {
            await CityModel.updateOne({
                _id: data.city
            }, {
                $push: {
                    zones: doc._id.toString()
                }
            });
        }

        return doc;
    }
}