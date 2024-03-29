import { DocumentType } from "@typegoose/typegoose/lib/types";
import assert from "assert";
import { Arg, Args, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";
import { CitiesArguments } from "../arguments/cities.arguments";
import { PaginationArguments } from "../arguments/pagination.arguments";
import { ZonesArguments } from "../arguments/zones.arguments";
import { ZonesFilter } from "../filters/zones.filter";
import { UpdateCityInput } from "../inputs/update_city.input";
import { City, CityModel } from "../models/city.model";
import { AuthRole, GideContext } from "../models/context.model";
import { State } from "../models/state.model";
import { Zone } from "../models/zone.model";
import { StateResolver } from "./state.resolver";
import { ZoneResolver } from "./zone.resolver";

@Resolver(City)
export class CityResolver {
    @Query(returns => [City], {description: "Obtiene las ciudades dentro de la republica mexicana. Si se ha iniciado sesión devuelve todas las ciudades, sino, devuelve únicamente las ciudades activadas."})
    async cities(@Args() args: CitiesArguments, @Ctx() context: GideContext): Promise<City[]> {
        let ref = CityModel.find();
        
        if(args.find){
            ref = args.find.filter(ref);
        }

        if (!context.auth) {
            ref = ref.find({
                isActive: true
            });
        }

        ref = args.paginate(ref);

        return await ref;
    }

    @Query(returns => City, {description: "Obtiene la ciudad por medio de su ID. En caso de no existir tira un error."})
    async city(@Arg("city", type => ID, {description: "ID de la ciudad a buscar"}) city: string): Promise<City> {
        const doc = await CityModel.findById(city);

        assert(doc, "No existe el documento");

        return doc;
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => City, {description: "Cambia el estado de activacion de la ciudad al valor opuesto."})
    async toggleCityActivation(@Arg("city", type => ID, {description: "ID de la ciudad a actualizar"}) city: string): Promise<City>{
        const doc = await CityModel.findById(city);

        assert(doc, "No existe el documento");

        doc.isActive = !doc.isActive;

        return (await doc.save() as DocumentType<City>);
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => City, {description: "Actualiza los datos del estado"})
    async updateCity(@Arg("data", {description: "Datos a actualizar"}) args: UpdateCityInput): Promise<City>{
        const doc = await CityModel.findById(args._id);

        assert(doc, "No existe el documento");

        if(args.bounds){
            doc.bounds = args.bounds;
        }

        return (await doc.save() as DocumentType<City>);
    }

    @FieldResolver(returns => State, {nullable: true, description: "Estado donde se situa la ciudad"})
    async state(@Root() city: DocumentType<City>): Promise<State> {
        if (city.state) {
            return new StateResolver().state(city.state.toString());
        } else {
            return null;
        }
    }

    @FieldResolver(returns => [Zone], {nullable: true, description: "Zonas en las que se divide la ciudad"})
    async zones(@Root() city: DocumentType<City>, @Args() args: PaginationArguments, @Ctx() context: GideContext): Promise<Zone[]> {
        const zonesArguments = new ZonesArguments();

        const filter = new ZonesFilter();
        filter.ids = city.zones.map<string>((zoneRef) => zoneRef.toString());

        zonesArguments.find = filter;
        zonesArguments.limit = args.limit;
        zonesArguments.skip = args.skip;

        return await new ZoneResolver().zones(zonesArguments, context);
    }
}