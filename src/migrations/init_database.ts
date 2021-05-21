import { mongoose } from "@typegoose/typegoose";
import { ADMIN_PASSWORD, DATABASE_URL, JWT_SECRET } from "../constants";
import states = require("./data/states.json");
import cities = require("./data/cities.json");
import { UserModel } from "../models/user.model";
import { AuthRole } from "../models/context.model";
import bcrypt = require('bcrypt');
import assert = require("assert");


async function initDatabase(){
    mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if(err){
            console.error(err);
        }
    });
    console.log("Base de datos en linea");

    await initStateCollection();
    await initCitiesCollection();
    await initAdminAccount();


    console.log("Base de datos iniciada");
    mongoose.disconnect();
}

initDatabase();


async function initStateCollection() {
    try{
        await mongoose.connection.dropCollection("states");
    }catch(e){
        console.error(e);
    }

    const insertedDocuments = await mongoose.connection.collection("states").insertMany(states.map((state) => {
        return {
            _id: mongoose.Types.ObjectId(state._id.$oid),
            cities: state.cities.map((cityId) => mongoose.Types.ObjectId(cityId.$oid)),
            createdAt: new Date(state.createdAt.$date),
            isActive: state.isActive,
            location: {
                type: state.location.type,
                coordinates: [state.location.coordinates[0], state.location.coordinates[1]]
            },
            name: state.name,
            updatedAt: new Date(state.updatedAt.$date),
            zoom: state.zoom
        };
    }));

    assert(insertedDocuments.insertedCount === states.length,  `Se han insertado ${insertedDocuments.insertedCount} de ${states.length}`);
}

async function initCitiesCollection() {
    try{
        await mongoose.connection.dropCollection("cities");
    }catch(e){
        console.error(e);
    }
    
    const insertedDocuments = await mongoose.connection.collection("cities").insertMany(cities.map((city) => {
        return {
            _id: mongoose.Types.ObjectId(city._id.$oid),
            createdAt: new Date(city.createdAt.$date),
            isActive: city.isActive,
            location: {
                type: city.location.type,
                coordinates: [city.location.coordinates[0], city.location.coordinates[1]]
            },
            name: city.name,
            updatedAt: new Date(city.updatedAt.$date),
            zones: city.zones.map((zoneId) => mongoose.Types.ObjectId(zoneId.$oid)),
            zoom: city.zoom,
            state: mongoose.Types.ObjectId(city.state.$oid)
        };
    }));


    assert(insertedDocuments.insertedCount === cities.length,  `Se han insertado ${insertedDocuments.insertedCount} de ${cities.length}`);
}


async function initAdminAccount() {
    try{
        await UserModel.deleteOne({
            username: "GIDE_ADMIN"
        });
    }catch(e){
        console.error(e);
    }

    await UserModel.create({
        _id: "60a6018b6b0bb34adcbb049e",
        username: "GIDE_ADMIN",
        name: "Administrador",
        role: AuthRole.ADMIN,
        password: bcrypt.hashSync(ADMIN_PASSWORD, 10)
    });
}