import { Arg, Args, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { AuthRole } from "../models/context.model";
import { File, FileModel } from "../models/file.model";
import { Storage } from "@google-cloud/storage";
import gpc_config from '../../gcp_config.json';
import path = require("path");
import assert = require("assert");
import { FilesArguments } from "../arguments/files.arguments";
import { UploadFileInput } from "../inputs/upload_file.input";



@Resolver(File)
export class FileResolver {
    storage = new Storage({
        credentials: gpc_config
    });

    @Authorized(AuthRole.ADMIN)
    @Query(returns => [File], {description: "Obtiene una coleccion de archivos"})
    async files(@Args() args: FilesArguments): Promise<File[]> {
        let ref = FileModel.find();
        
        if(args.find){
            ref = args.find.filter(ref);
        }

        return await ref;
    }

    @Authorized(AuthRole.ADMIN)
    @Query(returns => File, {description: "Obtiene el archivo por medio de su ID. En caso de no existir tira un error."})
    async file(@Arg("file", type => ID, {description: "ID del archivo a buscar"}) file: string): Promise<File> {
        let ref = FileModel.findById(file);

        const doc = await ref;

        assert(doc, "No existe el documento");

        return doc;
    }
    
    @Authorized(AuthRole.ADMIN)
    @Mutation(returns => File)
    async uploadFile(@Arg("data") { bucketPath, fileUpload }: UploadFileInput): Promise<File>{
        return new Promise((resolve, reject) => {
            const fullPath = path.join(bucketPath, fileUpload.filename);
            const readStream = fileUpload.createReadStream();

            const uploadStream = this.storage
                .bucket("gide_uploads_bucket")
                .file(fullPath)
                .createWriteStream({
                    metadata: {
                        contentType: fileUpload.mimetype
                    }
                });

            readStream
                .pipe(uploadStream)
                .on('finish', async () => {
                    readStream.close();
                    const fileDocument = await FileModel.create({
                        bucketPath: fullPath,
                        fileName: fileUpload.filename,
                        encoding: fileUpload.encoding,
                        mimeType: fileUpload.mimetype
                    });
                    resolve({
                        ...fileDocument,
                        url: (await this.storage.bucket("gide_uploads_bucket").file(fullPath).getSignedUrl({
                            version: 'v2',
                            action: "read",
                            expires: Date.now() + 1000 * 60 * 24 * 365 * 100
                        }))[0]
                    });
                }).on('error', (err) => {
                    reject(err);
                });
        });
    }
}