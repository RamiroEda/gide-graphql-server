import { AuthChecker } from "type-graphql";
import { GideContext, AuthRole } from "./models/context.model";
import { AuthModel } from "./models/auth.model";
import { UserModel } from "./models/user.model";

export const customAuthChecker: AuthChecker<GideContext, AuthRole> = async ({ context }, roles) : Promise<boolean> => {
    const authBelongsToUser = await AuthModel.exists({
        $and: [
            {
                userId: context.userId
            },
            {
                accessToken: context.accessToken
            }
        ]
    });

    const userDocument = await UserModel.findById(context.userId);

    return authBelongsToUser && roles.includes(userDocument.role);
};