import { DocumentType, mongoose } from "@typegoose/typegoose";
import assert from "assert";
import { Arg, Args, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";
import { PropertiesArguments } from "../arguments/properties.arguments";
import { CurrencyConverter } from "../currencies/currency_converter";
import { AddPropertyInput } from "../inputs/add_property.input";
import { City, CityModel } from "../models/city.model";
import { AuthRole, GideContext } from "../models/context.model";
import { File } from "../models/file.model";
import { Location, locationToGeoJSON } from "../models/location.model";
import { Property, PropertyModel } from "../models/property.model";
import { PropertyStatus } from "../models/property_status.model";
import { State, StateModel } from "../models/state.model";
import { Zone } from "../models/zone.model";
import { CityResolver } from "./city.resolver";
import { FileResolver } from "./file.resolver";
import { StateResolver } from "./state.resolver";
import { ZoneResolver } from "./zone.resolver";
import path = require("path");
import { FilesArguments } from "../arguments/files.arguments";
import { FilesFilter } from "../filters/files.filter";
import { UpdatePropertyInput } from "../inputs/update_property.input";
import { cleanObject } from "../utils";
import { TristateBoolean } from "../models/tristate_boolean";

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
        }else{
            if(!args.find?.status){
                ref = ref.find({
                    status: {
                        $ne: PropertyStatus.UNAVAILABLE
                    }
                });
            }
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
        const doc = await PropertyModel.findById(property);

        assert(doc, "No existe el documento");

        return doc;
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Property, {description: "Añade un inmueble dentro del sistema de compraventa. Admin role required."})
    async addProperty(@Arg("data", {description: "Información a ingresar en el sistema de compraventa"}) data: AddPropertyInput): Promise<Property>{
        assert(data.propertyPictures.length > 0, "Debe subirse al menos una fotografia");

        const stateDocument = await StateModel.findById(data.stateId);

        assert(stateDocument, "El identificador del Estado no existe.");
        assert(stateDocument.cities.includes(data.cityId), "La Ciudad seleccionada no se encuentra dentro del Estado.")

        const cityDocument = await CityModel.findById(data.cityId);

        assert(cityDocument, "El identificador de la Ciudad no existe.");
        if(data.zoneId){
            assert(cityDocument.zones.includes(data.zoneId), "La Zona seleccionada no se encuentra dentro de la Ciudad.")
        }

        const fileResolver = new FileResolver();
        const pictures: File[] = [];
        const objectId = mongoose.Types.ObjectId();

        for (const file of data.propertyPictures) {
            pictures.push(await fileResolver.uploadFile({
                bucketPath: path.join("properties", objectId.toHexString()),
                fileUpload: file
            }));
        }

        return await PropertyModel.create({
            _id: objectId,
            ...data,
            city: data.cityId,
            state: data.stateId,
            zone: data.zoneId,
            pictures: pictures.map((pic) => pic._id),
            status: PropertyStatus.AVAILABLE,
            location: locationToGeoJSON(data.location)
        });
    }

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Property, {description: "Añade un inmueble dentro del sistema de compraventa. Admin role required."})
    async updateProperty(@Arg("data", {description: "Información a actualizar en el sistema de compraventa"}) data: UpdatePropertyInput): Promise<Property>{
        if(data.stateId || data.cityId || data.zoneId){
            assert(data.stateId && data.cityId, "Deben actualizarse los dos IDs simultaneamente");
            const stateDocument = await StateModel.findById(data.stateId);

            assert(stateDocument, "El identificador del Estado no existe.");
            
            assert(stateDocument.cities.includes(data.cityId), "La Ciudad seleccionada no se encuentra dentro del Estado.")
            const cityDocument = await CityModel.findById(data.cityId);

            assert(cityDocument, "El identificador de la Ciudad no existe.");
            assert(cityDocument.zones.includes(data.zoneId), "La Zona seleccionada no se encuentra dentro de la Ciudad.")
        }

        const arePetsAllowedTmp = data.arePetsAllowed;
        delete data.arePetsAllowed;
        const dataTmp: any = data;

        if(arePetsAllowedTmp != null){
            switch(arePetsAllowedTmp){
                case TristateBoolean.TRUE:
                    dataTmp.arePetsAllowed = true;
                    break;
                case TristateBoolean.FALSE:
                    dataTmp.arePetsAllowed = false;
                    break;
                case TristateBoolean.NULL:
                    dataTmp.arePetsAllowed = null;
                    break;
            }
        }

        return await PropertyModel.findByIdAndUpdate(data._id, cleanObject({
            ...dataTmp,
            location: locationToGeoJSON(dataTmp.location)
        }), {
            new: true
        });
    }

    @FieldResolver(type => [File], {description: "Lista de fotografias del inmueble"})
    async pictures(@Root() property: DocumentType<Property>): Promise<File[]>{
        const args = new FilesArguments();
        
        const filter = new FilesFilter();
        filter.ids = property.pictures.map((pic) => pic.toString());

        args.find = filter;

        return await new FileResolver().files(args);
    }

    @FieldResolver(type => File, {description: "La primer imagen de la lista de fotografias"})
    async thumbnail(@Root() property: DocumentType<Property>): Promise<File>{
        return await new FileResolver().file(property.pictures[0].toString());
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