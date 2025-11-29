import { Events, } from "discord.js";
import { loadCommandsOnServer } from "../Loaders/LoadCommands.js";
const name = Events.GuildCreate;
const exec = async (bot, guild) => {
    await loadCommandsOnServer(bot, guild.id);
    return;
};
export { name, exec };
