import {
    ButtonInteraction,
    CommandInteraction,
    Events, Guild,
    MessageFlags,
    TextChannel,
} from "discord.js"
import * as path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
import {CBot} from "../class/CBot.js";
import { script_t } from "../config/types.js";
import {getFile, loadCommandsOnServer} from "../Loaders/LoadCommands.js";


const name = Events.GuildCreate;


const exec = async (bot : CBot, guild : Guild ) =>  {

    await loadCommandsOnServer(bot,guild.id);
    return;
}

export{name,exec}
