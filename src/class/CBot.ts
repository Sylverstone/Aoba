import {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from "discord.js"
import { script_t } from "../config/types.js";
import { collections_t } from "../Connection/connection";



//Renvoie true si le paramètre est un script_t
export const isScript_t = (script : unknown) : script is script_t =>
{
    return script !== null && typeof script === "object"  && "name" in script && "description" in script
            && "howToUse" in script && "run" in script && "onlyGuild" in script;
}


export class CBot extends Client{

    public commands : Collection<string,script_t>;
    public collections : collections_t;

    constructor(collections : collections_t){
        super({
            intents: [
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,

            ],
            partials : [Partials.Message, Partials.Channel, Partials.Reaction]
            
        })

        this.commands = new Collection();
        this.collections = collections;

    }

    public getToken() : string
    {
        return process.env.TOKEN ?? "token";
    }
   
    public getID() : string
    {
        return process.env.CLIENTID ?? "";
    }

}
