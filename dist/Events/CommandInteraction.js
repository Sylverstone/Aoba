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
    if (interaction.isChatInputCommand() || interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) {
        const commandName = interaction.commandName;
        const filePath = pathToFileURL(path.join(__dirname, "Commands", commandName + ".js"));
        const command = await getFile(filePath.href);
        const { run } = command;
        run(bot, interaction);
    }
    return;
};
export { name, exec };
