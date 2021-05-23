import { MinLength } from "class-validator";
import { ArgsType, Field } from "type-graphql";


@ArgsType()
export class LoginArguments {
    @Field({description: "Nombre de usuario"})
    @MinLength(1)
    username: string;

    @Field({description: "Contraseña del usuario"})
    @MinLength(8)
    password: string;
}