import "reflect-metadata";
require("dotenv").config();
import { buildSchema } from "type-graphql";
import { mongoose } from "@typegoose/typegoose";
import { DATABASE_URL, JWT_SECRET, PORT } from "./constants";
import { ApolloServer } from "apollo-server";
import { customAuthChecker } from "./auth";
import { GideContext } from "./models/context.model";
import { ExpressContext } from "apollo-server-express";
import jwt = require("jsonwebtoken");
import { AuthModel } from "./models/auth.model";

async function bootstrap() {
    // Coneccion con la base de datos
    mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if (err) {
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
        context: async function (expressContext: ExpressContext): Promise<GideContext> {
            const token = expressContext.req.headers.authorization?.split(" ");

            if (token?.length === 2) {
                try {
                    const decodedToken = jwt.verify(token[1], JWT_SECRET) as {
                        _id: string;
                    };
    
                    if (decodedToken) {
                        const auth = await AuthModel.findOne({
                            $and: [
                                { userId: decodedToken._id },
                                { accessToken: token[1] }
                            ]
                        });
    
                        return <GideContext>{
                            auth
                        };
                    }
                } catch (e) {
                    console.error(e);
                }
            }

            return {};
        }
    });

    server.listen(PORT);

    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}


bootstrap();