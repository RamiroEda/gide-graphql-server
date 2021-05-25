import { Args, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Auth, AuthModel } from "../models/auth.model";
import { LoginArguments } from "../arguments/login.arguments";
import { GideContext } from "../models/context.model";
import jwt = require("jsonwebtoken");
import bcrypt = require("bcrypt");
import { JWT_SECRET } from "../constants";
import { UserModel } from "../models/user.model";

@Resolver(Auth)
export class AuthResolver {
    @Mutation(returns => Auth, {nullable: true, description: "Inicia sesión dentro del sistema"})
    async login(@Args() { username, password }: LoginArguments): Promise<Auth> {
        const userDocument = await UserModel.findOne({
            username: username
        });

        if (userDocument) {
            if (bcrypt.compareSync(password, userDocument.password)) {
                const accessToken = jwt.sign({
                    _id: userDocument._id
                }, JWT_SECRET, {
                    expiresIn: "1d"
                });
    
                return await AuthModel.create({
                    userId: userDocument._id,
                    accessToken: accessToken,
                    tokenType: "Bearer"
                });
            }
        }

        return null;
    }

    @Authorized()
    @Mutation(returns => Boolean, {nullable: true, description: "Cierra la sesión del sistema. Auth required."})
    async logout(@Ctx() context: GideContext): Promise<boolean> {
        if (AuthModel.deleteOne({
            $and: [
                { userId: context.auth.userId },
                { accessToken: context.auth.accessToken }
            ]
        })) {
            return true;
        }

        return false;
    }
}