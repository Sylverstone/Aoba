import * as fs from "fs";
import * as path from "path";
import __dirname from "../dirname.js";
import { pathToFileURL } from "url";
const loadEvenements = async (bot) => {
    try {
        const Events = fs.readdirSync(path.join("dist", "Events")).filter(file => file.endsWith(".js"));
        console.log("loading", Events.length, "events");
        for (const file of Events) {
            const Event = await import(pathToFileURL(path.join(__dirname, "Events", file)).href);
            const name = Event.name;
            const exec = Event.exec;
            bot.on(name, (...args) => {
                try {
                    exec(bot, ...args);
                }
                catch (err) {
                    console.error("ERROR\n", err);
                }
            });
        }
        console.log("successfully loaded", Events.length, "events");
    }
    catch (error) {
        console.error("[ERROR] Error while loading events :", error);
        throw error;
    }
};
export default loadEvenements;
