import { mongoose } from "@typegoose/typegoose";
import { DATABASE_URL } from "../constants";
import { CityResolver } from "../resolvers/city.resolver";
import { StateResolver } from "../resolvers/state.resolver";
import states = require("./data/mexico_estados.json");
import municipalities = require("./data/mexico_estados_municipios.json");


async function initDatabase(){
    await mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if(err){
            console.error(err);
        }
    });
    console.log("Base de datos en linea");

    await initStateCollection();
    await initCitiesCollection();


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

    const stateResolver = new StateResolver();

    for (const state of states) {
        await stateResolver.addState({
            name: state.nombre,
            location: {
                latitude: 0,
                longitude: 1
            },
            zoom: 12
        });
    }
}

async function initCitiesCollection() {
    try{
        await mongoose.connection.dropCollection("cities");
    }catch(e){
        console.error(e);
    }
    
    const cityResolver = new CityResolver();
    const stateResolver = new StateResolver();

    const states = await stateResolver.states({});

    for (const state of states) {
        console.log(state._id, state.name);
        
        for (const municipality of municipalities[state.name]) {
            await cityResolver.addCity({
                name: municipality,
                location: {
                    latitude: 0,
                    longitude: 1
                },
                zoom: 12,
                zoneIds: [],
                stateId: state._id
            });
        }
    }
}