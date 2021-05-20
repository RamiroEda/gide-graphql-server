import { Express } from 'express';


export function startDebugGraphiQL(app : Express){
    console.log("🔄 Starting GraphiQL");

    app.get("/", (req: any, res: any) => {
        res.sendFile(__dirname+"/graphiql/index.html");
    });
}