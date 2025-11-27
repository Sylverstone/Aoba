import { Client, Collection, GatewayIntentBits, Partials, } from "discord.js";
//Renvoie true si le paramètre est un script_t
export const isScript_t = (script) => {
    return script !== null && typeof script === "object" && "name" in script && "description" in script
        && "howToUse" in script && "run" in script && "onlyGuild" in script;
};
export class CBot extends Client {
    constructor(collections) {
        super({
            intents: [
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction]
        });
        this.commands = new Collection();
        this.collections = collections;
    }
    getToken() {
        return process.env.TOKEN ?? "token";
    }
    getID() {
        return process.env.CLIENTID ?? "";
    }
}
