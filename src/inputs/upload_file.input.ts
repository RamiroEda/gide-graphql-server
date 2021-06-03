import { GraphQLUpload, FileUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";


@InputType()
export class UploadFileInput {
    @Field(type => GraphQLUpload, {description: "Archivo a subir al sistema"}) 
    fileUpload: FileUpload;
    
    @Field({description: "Directorio a guardar el archivo"}) 
    bucketPath: string;
}