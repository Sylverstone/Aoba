import { IsCustomCommandJson_t } from "../config/types.js";
import * as fs from "fs";
import * as mongoose from "mongoose";
import { connect, model, disconnect, Schema } from "mongoose";
import * as path from "path";
import __dirname from "../dirname.js";
import Utils from "../class/Utils.js";
const customCommandSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: String, required: true },
    message_ephemere: { type: String, required: false }
});
export default class ModelCustomCommand {
    constructor() {
        this.Model = mongoose.model("Test", customCommandSchema);
        this.collectionName = "";
    }
    async connect() {
        this.connection = (await connect(process.env.DB_URL ?? "")).connection;
    }
    async setCollection(collectionName) {
        this.collectionName = collectionName.toLowerCase();
        if (!await this.CollectionExist(this.collectionName))
            return false;
        this.Model = model(this.collectionName, customCommandSchema);
        return true;
    }
    async GetAllCustomCommands() {
        if (!this.Model)
            return [];
        console.log("start find");
        const data = await this.Model.find({});
        if (!data)
            return [];
        console.log(data);
        return data;
    }
    async CollectionExist(collectionName) {
        const db = this.connection.db;
        if (!db) {
            console.log("db null");
            return false;
        }
        console.log(await db.listCollections().toArray());
        return (await db.listCollections().toArray()).filter(e => e.name === collectionName.toLowerCase()).length >= 1;
    }
    async InsertCustomCommand(doc) {
        const data = new this.Model(doc);
        try {
            await data.save();
        }
        catch (err) {
            console.error("[FAILED DURING SAVE]" + err);
        }
    }
    static GetGuildJsonData(guildId, guildName) {
        const pathToJSONData = path.join(__dirname, "..", "data", Utils.GenerateCollectionName(guildId, guildName) + ".json");
        if (!fs.existsSync(pathToJSONData))
            return null;
        const JsonData = JSON.parse(fs.readFileSync(pathToJSONData).toString());
        if (!IsCustomCommandJson_t(JsonData))
            return null;
        return JsonData;
    }
    async close() {
        await disconnect();
    }
}
