import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseModel } from "./model";


@ObjectType({description: "Archivo subido dentro del sistema"})
export class File implements BaseModel{
    @Field(type => ID, {description: "ID del archivo"})
    readonly _id: string;

    @Field({description: "URL publica del archivo"})
    @prop()
    url: string;

    @prop()
    bucketPath: string;

    @Field({description: "Tipo de extension multipropósito de correo de internet"})
    @prop()
    mimeType: string;

    @Field({description: "Nombre del archivo. Incluye la extencion."})
    @prop()
    fileName: string;

    @Field({description: "Codificacion del archivo"})
    @prop()
    encoding: string;

    @Field({description: "Fecha de adicion del documento"})
    readonly createdAt: Date;

    @Field({description: "Fecha de modificacion del documento"})
    updatedAt: Date;
}


export const FileModel = getModelForClass(File, {
    schemaOptions: {
        timestamps: true
    }
});