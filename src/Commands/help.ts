import {ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {script_t} from "../config/types.js";
import {CommandType_t} from "../Loaders/LoadCommands.js";
import {CBot} from "../class/CBot.js";

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

        await interaction.reply({embeds : [
                {
                    title : "",
                    description : `# Liste des commandes d'${bot.user?.displayName ?? "Aoba"}\n\n\n${bot.helpTexte}`,
                    color : 0x6910ff,
                    timestamp : new Date().toISOString(),
                    footer : {
                        icon_url : bot.user?.displayAvatarURL() ?? "",
                        text : "Au plaisir"
                    },
                }
            ], flags : [MessageFlags.Ephemeral]});
    }
}

export default Commande;