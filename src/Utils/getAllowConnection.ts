import * as fs from "fs";
import __dirname from "../dirname.js";
import * as path from "path";
import {setting_t} from "../Commands/toggle_connection.js";

export default function getAllowConnection() {
    const strJson = fs.readFileSync(path.join(__dirname,"..","settings.json"));
    const js = JSON.parse(strJson.toString()) as setting_t;

    return js.allowConnection;

}