import {ChatInputCommandInteraction, MessageFlags,APIEmbedField} from "discord.js";
import {script_t} from "../config/types.js";
import {CommandType_t} from "../Loaders/LoadCommands.js";
import {CBot, isScript_t} from "../class/CBot.js";
import * as fs from "fs";
import * as path from "path";
import __dirname from "../dirname.js";
import {pathToFileURL} from "url";

type CommandData = {
    name : string,
    description : string,
    admin : boolean,
    type : CommandType_t
}

const Commande : script_t = 
{
    name : "help",
    description : "hello",
    howToUse : "Entrez simplement la commande `/help`",
    admin : false,
    typeCommand : CommandType_t.CHAT_INPUT,

    run : async function(bot : CBot, interaction : ChatInputCommandInteraction){

        console.log("help");
        await interaction.deferReply({ flags : [MessageFlags.Ephemeral]});
        let texte = "";
        const Commandes = fs.readdirSync(path.join(__dirname,"Commands")).filter(p => !p.includes("help")).map(p => {
            return path.join(__dirname,"Commands", p);
        })

        console.log(Commandes);
        for(const commande of Commandes)
        {
            const Commande= (await import(pathToFileURL(commande).href)).default;
            console.log(Commande)
            if(!isScript_t(Commande))
                continue;

            texte += `${Commande.admin ? "👮‍♂️" : "👤"} **${Commande.name}**\n> ${Commande.description}\n\n`;
        }

        texte += "\n*‍👮‍ Signifie que la commande est utilisable que par les admins. 👤 Signifie que tous le monde peut l'utiliser.*"

        await interaction.editReply({embeds : [
                {
                    title : "",
                    description : `# Liste des commandes d'${bot.user?.displayName ?? "Aoba"}\n\n\n${texte}`,
                    color : 0x6910ff,
                    timestamp : new Date().toISOString(),
                    footer : {
                        icon_url : bot.user?.displayAvatarURL() ?? "",
                        text : "Au plaisir"
                    },
                }
            ]});
    }
}

export default Commande;