import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Field, ID, InputType, registerEnumType } from "type-graphql";


@InputType()
export class UpdateFileInput {
    @Field(type => ChangeType, {description: "Tipo de modificacion del archivo"})
    type: ChangeType;

    @Field(type => ID, {nullable: true, description: "ID del archivo a modificar"})
    id?: string;


    @Field(type => GraphQLUpload, {nullable: true, description: "Fotografias del inmueble a actualizar"})
    file?: FileUpload;
}


export enum ChangeType{
    UPDATE = "update",
    DELETE = "delete",
    CREATE = "create"
}

registerEnumType(ChangeType, {
    name: "ChangeType",
    description: "Tipo de modificacion del archivo"
});