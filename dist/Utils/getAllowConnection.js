import * as fs from "fs";
import __dirname from "../dirname.js";
import * as path from "path";
export default function getAllowConnection() {
    const strJson = fs.readFileSync(path.join(__dirname, "..", "settings.json"));
    const js = JSON.parse(strJson.toString());
    return js.allowConnection;
}
