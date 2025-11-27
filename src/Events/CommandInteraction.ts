import {
    ButtonInteraction,
    CommandInteraction,
    Events,
    MessageFlags,
    TextChannel,
} from "discord.js"
import * as path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
import {CBot} from "../class/CBot.js";
import { script_t } from "../config/types.js";
import { getFile } from "../Loaders/LoadCommands.js";


const name = Events.InteractionCreate;
export const capFirstLetter = (str : string) => 
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const exec = async (bot : CBot, interaction : CommandInteraction | ButtonInteraction  ) =>  {

    if(interaction.isChatInputCommand() || interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand())
    {
        const commandName = interaction.commandName;
        const filePath = pathToFileURL(path.join(__dirname,"Commands",commandName + ".js"));
        const command : script_t = await getFile(filePath.href);
        const { run } = command;
        run(bot,interaction)
    }
    return;
}

export{name,exec}
