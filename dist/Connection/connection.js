import * as mongodb from "mongodb";
import * as dotenv from "dotenv";
import __dirname from "../dirname.js";
import path from "node:path";
export const collections = {};
export async function connect() {
    dotenv.config({
        path: path.join(__dirname, "..", ".env")
    });
    const client = new mongodb.MongoClient(process.env.DB_URL ?? "");
    await client.connect();
    const db = client.db("ParamsDB");
    const ParamsCollection = db.collection("ReactionRedirectionParams");
    collections.params = ParamsCollection;
    console.log("Connect look good");
}
/**
 * Un client mongoDB avec ses tables (collections) intégré.
 * */
export class CustomMongoClient extends mongodb.MongoClient {
    constructor(db_url) {
        super(db_url);
        this.collections = {};
    }
    async connect() {
        await super.connect();
        const db = this.db("ParamsDB");
        this.collections.params = db.collection("ReactionRedirectionParams");
        console.log("Connect look good");
        return this;
    }
    getCollections() {
        return this.collections;
    }
}
