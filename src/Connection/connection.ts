import * as mongodb from "mongodb";
import * as dotenv from "dotenv";
import __dirname from "../dirname.js";
import path from "node:path";
import params from "../DBModels/params";

export type collections_t = { params? : mongodb.Collection };
export const collections: collections_t = {};

export async function connect()
{
    dotenv.config({
        path : path.join(__dirname,"..",".env")
    });

    const client : mongodb.MongoClient = new mongodb.MongoClient(process.env.DB_URL ?? "");

    await client.connect();


    const db = client.db("ParamsDB");

    const ParamsCollection = db.collection("ReactionRedirectionParams");

    collections.params = ParamsCollection;

    console.log("Connect look good")
}

/**
 * Un client mongoDB avec ses tables (collections) intégré.
 * */
export class CustomMongoClient extends mongodb.MongoClient {
    private readonly collections : collections_t = {};

    constructor(db_url : string) {
        super(db_url);
    }

    public async connect() : Promise<this>{
        await super.connect();
        const db = this.db("ParamsDB");
        this.collections.params = db.collection("ReactionRedirectionParams");
        console.log("Connect look good")
        return this;
    }

    public getCollections()
    {
        return this.collections;
    }

}