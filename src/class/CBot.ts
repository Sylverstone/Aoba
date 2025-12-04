import {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from "discord.js"
import { script_t } from "../config/types.js";
import { collections_t } from "../Connection/connection";
import getAllCommands from "../Utils/getAllCommands.js";
import getAllowConnection from "../Utils/getAllowConnection.js";



//Renvoie true si le paramètre est un script_t
export const isScript_t = (script : unknown) : script is script_t =>
{
    return script !== null && typeof script === "object"  && "name" in script && "description" in script
            && script && "run" in script;
}


export class CBot extends Client{

    public commands : Collection<string,script_t>;
    public helpTexte : string = "";

    constructor(){
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

        getAllCommands().then(commands => {
            this.commands = commands;

            for(const [_,commande] of this.commands)
            {
                this.helpTexte += `${commande.admin ? "👮‍♂️" : "👤"} **${commande.name}**\n> ${commande.description}\n\n`;
            }

            this.helpTexte += "\n*‍👮‍ Signifie que la commande est utilisable que par les admins. 👤 Signifie que tous le monde peut l'utiliser.*";
        })

    }

    public getToken() : string
    {
        return process.env.TOKEN ?? "token";
    }

    public setupActivity(allowConnection : string = "")
    {

        if(allowConnection == "")
            allowConnection = getAllowConnection();

        if(allowConnection == "oui")
        {
            this.user?.setActivity("🥊 RED BLUE 🥊", {
                type : ActivityType.Watching
            })
        }
        else {
            this.user?.setActivity("👑 RED BLUE 👑", {
                type : ActivityType.Watching
            })
        }
    }
   
    public getID() : string
    {
        return process.env.CLIENTID ?? "";
    }

}
