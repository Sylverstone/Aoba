import * as fs from "fs"
import * as path from "path"
import __dirname from "../dirname.js"
import {CBot} from "../class/CBot.js"
import { pathToFileURL } from "url"

type exec_t = (Bot : CBot, ...message : any[]) => Promise<void>;

const loadEvenements = async (bot : CBot) =>
{
    try
    {
        const Events = fs.readdirSync(path.join("dist","Events")).filter(file => file.endsWith(".js"))
        console.log("loading",Events.length,"events")
        for(const file of Events)
        {
            const Event : { name : string, exec : any} = await import(pathToFileURL(path.join(__dirname,"Events",file)).href);
            const name : string = Event.name;
            const exec : exec_t = Event.exec;
            bot.on(name, (...args) => {
                try
                {
                    exec(bot,...args);
                }
                catch(err)
                {
                    console.error("ERROR\n",err);

                }
                    
            });
        }
        console.log("successfully loaded",Events.length,"events");
    }
    catch(error)
    {
        console.error("[ERROR] Error while loading events :",error);
        throw error;
    }
    
}

export default loadEvenements;