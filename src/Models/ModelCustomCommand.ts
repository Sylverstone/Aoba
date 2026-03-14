import {customCommand_t, CustomCommandJson_t, IsCustomCommandJson_t} from "../config/types.js";

import * as fs from "fs";
import * as mongoose from "mongoose";
import {connect, model, disconnect, mongo, createConnection, Schema} from "mongoose";
import * as path from "path";
import __dirname from "../dirname.js";
import Utils from "../class/Utils.js";

const customCommandSchema = new Schema<customCommand_t>({
    name : {type: String, required: true},
    description : {type: String, required: true},
    value : {type: String, required: true},
    message_ephemere : {type: String, required: false}
})

export default class ModelCustomCommand
{
    private Model = mongoose.model<customCommand_t>("Test",customCommandSchema);
    private collectionName : string = "";
    private connection! : mongoose.Connection;

    public constructor() {

    }

    public async connect()
    {

        this.connection = (await connect(process.env.DB_URL ?? "")).connection;
    }

    public async setCollection(collectionName : string)
    {
        this.collectionName = collectionName.toLowerCase();

        if(!await this.CollectionExist(this.collectionName))
            return false;

        this.Model = model<customCommand_t>(this.collectionName,customCommandSchema);
        return true;
    }

    public async GetAllCustomCommands() : Promise<customCommand_t[]>
    {
        if(!this.Model)
            return [];

        console.log("start find");
        const data = await this.Model.find({});

        if(!data)
            return [];
        console.log(data)
        return data;
    }

    public async CollectionExist(collectionName : string) : Promise<boolean>
    {
        const db = this.connection.db;
        if(!db)
        {
            console.log("db null");
            return false;
        }


        console.log(await db.listCollections().toArray());
        return (await db.listCollections().toArray()).filter(e => e.name === collectionName.toLowerCase()).length >= 1;
    }

    public async InsertCustomCommand(doc : customCommand_t)
    {
        const data = new this.Model(doc);
        try {
            await data.save();
        }
        catch (err)
        {
            console.error("[FAILED DURING SAVE]" + err);
        }

    }

    public static GetGuildJsonData(guildId : string, guildName : string): CustomCommandJson_t | null
    {
        const pathToJSONData = path.join(__dirname, "..","data",Utils.GenerateCollectionName(guildId, guildName) + ".json");

        if(!fs.existsSync(pathToJSONData))
            return null;

        const JsonData = JSON.parse(fs.readFileSync(pathToJSONData).toString());

        if(!IsCustomCommandJson_t(JsonData))
            return null;

        return JsonData;
    }

    public async close()
    {
       await disconnect();
    }
}