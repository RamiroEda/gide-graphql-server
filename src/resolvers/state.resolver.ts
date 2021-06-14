import { DocumentType } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";
import { CitiesArguments } from "../arguments/cities.arguments";
import { PaginationArguments } from "../arguments/pagination.arguments";
import { StatesArguments } from "../arguments/states.arguments";
import { CitiesFilter } from "../filters/cities.filter";
import { UpdateStateInput } from "../inputs/update_state.input";
import { City } from "../models/city.model";
import { AuthRole, GideContext } from "../models/context.model";
import { State, StateModel } from "../models/state.model";
import { CityResolver } from "./city.resolver";

@Resolver(State)
export class StateResolver {
    @Query(returns => [State], {description: "Obtiene los estados dentro de la republica mexicana. Si se ha iniciado sesion debolvera todos los estados, sino, devolvera los estados activados."})
    async states(@Args() args: StatesArguments, @Ctx() context: GideContext): Promise<State[]>{
        let ref = StateModel.find();

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

    @Query(returns => State, {description: "Obtiene el estado por medio de su ID."})
    async state(@Arg("state", type => ID, {description: "ID del estado a obtener."}) state: string): Promise<State>{
        const doc = await StateModel.findById(state);

        assert(doc, "No existe el documento");

        return doc;
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => State, {description: "Cambia el estado de activacion del estado al valor opuesto."})
    async toggleStateActivation(@Arg("state", type => ID, {description: "ID de la ciudad a actualizar"}) state: string): Promise<State>{
        const doc = await StateModel.findById(state);

        assert(doc, "No existe el documento");

        doc.isActive = !doc.isActive;

        return (await doc.save() as DocumentType<State>);
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => State, {description: "Actualiza los datos del estado"})
    async updateState(@Arg("data", {description: "Datos a actualizar"}) args: UpdateStateInput): Promise<State>{
        const doc = await StateModel.findById(args._id);

        assert(doc, "No existe el documento");

        if(args.bounds){
            doc.bounds = args.bounds;
        }

        return (await doc.save() as DocumentType<State>);
    }

    @FieldResolver(returns => [City], {nullable: true, description: "Ciudades que se encuentran dentro de este estado."})
    async cities(@Root() state: DocumentType<State>, @Args() args: PaginationArguments, @Ctx() context: GideContext): Promise<City[]>{
        const citiesArguments = new CitiesArguments();

        const filter = new CitiesFilter();
        filter.ids = state.cities.map<string>((cityRef) => cityRef.toString());

        citiesArguments.find = filter;
        citiesArguments.limit = args.limit;
        citiesArguments.skip = args.skip;

        return await new CityResolver().cities(citiesArguments, context);
    }
}