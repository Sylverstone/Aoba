import { Events, } from "discord.js";
import * as path from "path";
import { pathToFileURL } from "url";
import __dirname from "../dirname.js";
import { getFile } from "../Loaders/LoadCommands.js";
const name = Events.InteractionCreate;
export const capFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const exec = async (bot, interaction) => {
    if (!(interaction.isChatInputCommand() || interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand() || interaction.isAutocomplete()))
        return;
    const commandName = interaction.commandName;
    const filePath = pathToFileURL(path.join(__dirname, "Commands", commandName + ".js"));
    const command = await getFile(filePath.href);
    const { run, autocomplete } = command;
    if (interaction.isAutocomplete() && autocomplete)
        autocomplete(bot, interaction);
    else
        run(bot, interaction);
};
export { name, exec };
