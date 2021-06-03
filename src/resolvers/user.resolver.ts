import assert from "assert";
import { Arg, Authorized, Ctx, ID, Query, Resolver } from "type-graphql";
import { AuthRole, GideContext } from "../models/context.model";
import { User, UserModel } from "../models/user.model";



@Resolver(User)
export class UserResolver {
    @Authorized()
    @Query(returns => User, {description: "Obtiene al usuario por medio de su ID. En caso de no existir tira un error. Auth required."})
    async user(@Arg("user", type => ID, {description: "ID del usuario a buscar."}) user: string, @Ctx() context: GideContext): Promise<User> {
        const userDoc = await UserModel.findById(user);
        const contextUserDoc = await UserModel.findById(context.auth.userId);

        assert(userDoc, "El documento no existe");
        assert(userDoc?._id === context.auth?.userId || contextUserDoc?.role === AuthRole.ADMIN, "Acceso denegado");

        return userDoc;
    }

    @Authorized()
    @Query(returns => User, {description: "Retorna el usuario que ha iniciado sesion. Auth required."})
    async currentUser(@Ctx() context: GideContext): Promise<User> {
        return await UserModel.findById(context.auth.userId);
    }
}