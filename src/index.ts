import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { mongoose } from "@typegoose/typegoose";
import { DATABASE_URL, JWT_SECRET } from "./constants";
import { ApolloServer } from "apollo-server";
import { customAuthChecker } from "./auth";
import { GideContext } from "./models/context.model";
import { ExpressContext } from "apollo-server-express";
import jwt = require('jsonwebtoken');

async function bootstrap() {
    // Coneccion con la base de datos
    mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if(err){
            console.error(err);
        }
    });
    console.log("Base de datos en linea");
    

    // Inicializacion del servidor Apollo
    const schema = await buildSchema({
        resolvers: [__dirname + "/**/*.resolver.{ts,js}"],
        authChecker: customAuthChecker
    });

    const server = new ApolloServer({
        schema,
        introspection: true,
        playground: true,
        context: (expressContext : ExpressContext) => {
            const token = expressContext.req.header("Authorization").split(" ");

            if(token.length == 2){
                const decodedToken = jwt.verify(token[1], JWT_SECRET) as {
                    _id: string;
                };

                if(decodedToken){
                    return <GideContext>{
                        accessToken: token[1],
                        userId: decodedToken._id
                    };
                }
            }

            return {};
        }
    });

    server.listen(80);

    console.log(`🚀 Server ready at http://localhost:80${server.graphqlPath}`)
}


bootstrap();