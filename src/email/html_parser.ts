import { readFile } from "fs/promises";


export class HTMLParser {
    static async parse(filePath: string, parameters: any): Promise<string> {
        let file = await readFile(filePath, {
            encoding: "utf-8"
        });

        const params = Object.keys(parameters);

        for (const param of params) {
            file = file.replace(new RegExp(`{{${param}}}`, 'g'), parameters[param]);
        }

        return file;
    }
}