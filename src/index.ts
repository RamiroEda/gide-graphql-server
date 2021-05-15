import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { mongoose } from "@typegoose/typegoose";
import { DATABASE_URL, PORT } from "./constants";
import express = require("express");
import { ApolloServer } from "apollo-server-express";
import { startDebugGraphiQL } from "./graphiql-debug-server/server";

async function bootstrap() {
    // Coneccion con la base de datos
    await mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if(err){
            console.error(err);
        }
    });
    console.log("Base de datos en linea");

    // Inicializacion de express
    const app = express();
    

    // Inicializacion del servidor Apollo
    const schema = await buildSchema({
        resolvers: [__dirname + "/**/*.resolver.{ts,js}"],
    });

    const server = new ApolloServer({
        schema,
        introspection: true
    });

    server.applyMiddleware({app, path: "/graphql"});

    startDebugGraphiQL(app);

    app.listen({ port: 80 }, () =>
        console.log(`🚀 Server ready at http://localhost:80${server.graphqlPath}`)
    );
}

bootstrap();