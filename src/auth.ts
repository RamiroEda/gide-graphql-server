import { AuthChecker } from "type-graphql";
import { GideContext, AuthRole } from "./models/context.model";
import { UserModel } from "./models/user.model";

export const customAuthChecker: AuthChecker<GideContext, AuthRole> = async ({ context }, roles) : Promise<boolean> => {
    if(!context.auth) return false;
    if(context.auth && roles.length === 0) return true;

    const userDocument = await UserModel.findById(context.auth.userId);

    return context.auth && roles.includes(userDocument.role);
};