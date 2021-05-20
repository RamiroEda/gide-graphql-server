import { Args, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Auth, AuthModel } from "../models/auth.model";
import { LoginArguments } from "../arguments/login.arguments";
import { AuthRole, GideContext } from "../models/context.model";
import jwt = require('jsonwebtoken');
import bcrypt = require('bcrypt');
import { JWT_SECRET } from "../constants";
import { UserModel } from "../models/user.model";

@Resolver(Auth)
export class AuthResolver {
    @Mutation(returns => Auth, {nullable: true})
    async login(@Args() { username, password } : LoginArguments) : Promise<Auth> {
        const userDocument = await UserModel.findOne({
            username: username
        });

        if(userDocument){
            if(bcrypt.compareSync(password, userDocument.password)){
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

    @Authorized([AuthRole.ADMIN])
    @Mutation(returns => Boolean, {nullable: true})
    async logout(@Ctx() context : GideContext) : Promise<boolean>{
        if(AuthModel.deleteOne({
            $and: [
                {
                    userId: context.userId
                },
                {
                    accessToken: context.accessToken
                }
            ]
        })){
            return true;
        }

        return false;
    }
}