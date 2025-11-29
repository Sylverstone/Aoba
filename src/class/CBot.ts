import {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from "discord.js"
import { script_t } from "../config/types.js";
import { collections_t } from "../Connection/connection";
import getAllCommands from "../Utils/getAllCommands.js";



//Renvoie true si le paramètre est un script_t
export const isScript_t = (script : unknown) : script is script_t =>
{
    return script !== null && typeof script === "object"  && "name" in script && "description" in script
            && script && "run" in script;
}


export class CBot extends Client{

    public commands : Collection<string,script_t>;
    //pas obliger vu que collections est accéssible de partout avec un import mais why not
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

        getAllCommands().then(commands => {
            this.commands = commands;
        })

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
