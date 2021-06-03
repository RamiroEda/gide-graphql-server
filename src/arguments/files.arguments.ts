import { ArgsType, Field } from "type-graphql";
import { FilesFilter } from "../filters/files.filter";



@ArgsType()
export class FilesArguments {
    @Field(type => FilesFilter, {nullable: true, description: "Va a devolver los documentos que cumplan con los requisitos definidos"})
    find?: FilesFilter;
}