import { MinLength } from "class-validator";
import { ArgsType, Field } from "type-graphql";


@ArgsType()
export class LoginArguments{
    @Field()
    @MinLength(1)
    username: string;

    @Field()
    @MinLength(8)
    password: string;
}