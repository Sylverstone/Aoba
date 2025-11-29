import * as mongodb from "mongodb";
import * as dotenv from "dotenv";
import __dirname from "../dirname.js";
import path from "node:path";

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