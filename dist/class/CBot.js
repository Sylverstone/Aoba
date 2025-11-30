import { Client, Collection, GatewayIntentBits, Partials, } from "discord.js";
import getAllCommands from "../Utils/getAllCommands.js";
//Renvoie true si le paramètre est un script_t
export const isScript_t = (script) => {
    return script !== null && typeof script === "object" && "name" in script && "description" in script
        && script && "run" in script;
};
export class CBot extends Client {
    constructor() {
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
        this.helpTexte = "";
        this.commands = new Collection();
        getAllCommands().then(commands => {
            this.commands = commands;
            for (const [_, commande] of this.commands) {
                this.helpTexte += `${commande.admin ? "👮‍♂️" : "👤"} **${commande.name}**\n> ${commande.description}\n\n`;
            }
            this.helpTexte += "\n*‍👮‍ Signifie que la commande est utilisable que par les admins. 👤 Signifie que tous le monde peut l'utiliser.*";
        });
    }
    getToken() {
        return process.env.TOKEN ?? "token";
    }
    getID() {
        return process.env.CLIENTID ?? "";
    }
}
