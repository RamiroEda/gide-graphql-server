import { DocumentType } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";
import { PropertiesArguments } from "../arguments/properties.arguments";
import { CurrencyConverter } from "../currencies/currency_converter";
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
    @Query(returns => [Property], {description: "Obtiene las propiedades registradas en el sistema de compraventa. Si se ha iniciado sesión devolverá todos los inmuebles, sino, devolverá unicamente los inmuebles disponibles."})
    async properties(@Args() args: PropertiesArguments, @Ctx() context: GideContext): Promise<Property[]> {
        let ref = PropertyModel.find();

        if(args.find){
            ref = (await args.find.customFilter(ref, args.currency)).ref;
        }

        if(!context.auth) {
            ref = ref.find({
                status: PropertyStatus.AVAILABLE
            });
        }

        if(args.sort){
            ref = args.sort.sort(ref);
        }

        ref = args.paginate(ref);

        return await Promise.all(
            (await ref).map<Promise<DocumentType<Property>>>(async (doc) => {
                doc.price = await CurrencyConverter.convert(doc.price, args.currency);
    
                return doc;
            })
        );
    }

    @Query(returns => Property, {description: "Obtiene un inmueble por medio de su ID."})
    async property(@Arg("property", {description: "ID del inmueble a obtener."}) property: string): Promise<Property>{
        let ref = PropertyModel.findById(property);

        const doc = await ref;

        assert(doc, "No existe el documento");

        return doc;
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Property, {description: "Actualiza el estado de la solicitud de contacto"})
    async updatePropertyStatus(
        @Arg("property", type => ID, {description: "ID de la solicitud"}) property: string,
        @Arg("status", type => PropertyStatus, {description: "Nuevo estado de la solicitud"}) status: PropertyStatus
    ): Promise<Property> {
        return await PropertyModel.findByIdAndUpdate(property, {
            status
        });
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Property, {description: "Añade un inmueble dentro del sistema de compraventa. Admin role required."})
    async addProperty(@Arg("data", {description: "Información a ingresar en el sistema de compraventa"}) data: PropertyInput): Promise<Property>{
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

    @FieldResolver(returns => Location, {description: "Ubicación geografica del inmueble."})
    location(@Root() property: DocumentType<Property>): Location{
        return {
            latitude: property.location.coordinates[0],
            longitude: property.location.coordinates[1]
        };
    }

    @FieldResolver(returns => State, {description: "Estado donde se encuentra el inmueble."})
    async state(@Root() property: DocumentType<Property>): Promise<State>{
        return new StateResolver().state(property.state.toString());
    }

    @FieldResolver(returns => City, {description: "Ciudad donde se encuentra del inmueble."})
    async city(@Root() property: DocumentType<Property>): Promise<City>{
        return new CityResolver().city(property.city.toString());
    }

    @FieldResolver(returns => Zone, {description: "Zona donde se encuentra el inmueble."})
    async zone(@Root() property: DocumentType<Property>): Promise<Zone>{
        if(property.zone){
            return new ZoneResolver().zone(property.zone.toString());
        }else{
            return null;
        }
    }
}