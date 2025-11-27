import {ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {script_t} from "../config/types.js";
import {CommandType_t} from "../Loaders/LoadCommands.js";
import {CBot} from "../class/CBot";


type CommandData = {
    name : string,
    description : string,
    admin : boolean,
    type : CommandType_t
}

const Commande : script_t = 
{
    name : "hello",
    description : "hello",
    admin : false,
    typeCommand : CommandType_t.CHAT_INPUT,

    run : async function(bot : CBot, interaction : ChatInputCommandInteraction){

        console.log(await bot.collections.params?.deleteMany({}));

        return interaction.reply("ok google");

    }
}

export default Commande;