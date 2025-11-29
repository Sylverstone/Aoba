import { REST, Routes } from "discord.js";
import "dotenv/config";
import CommandBuilder from "../class/CommandBuilder.js";
export const getFile = async (fileUrl) => {
    const module = await import(fileUrl);
    return module.default;
};
export var CommandType_t;
(function (CommandType_t) {
    CommandType_t[CommandType_t["USERCOMMAND"] = 2] = "USERCOMMAND";
    CommandType_t[CommandType_t["CHAT_INPUT"] = 1] = "CHAT_INPUT";
    CommandType_t[CommandType_t["MESSAGE_COMMAND"] = 3] = "MESSAGE_COMMAND";
})(CommandType_t || (CommandType_t = {}));
const setupLoad = async (bot, guildIds) => {
    let Commands = [];
    for (const [_, commande] of bot.commands) {
        const desc = commande.typeCommand === CommandType_t.CHAT_INPUT ? commande.description : "";
        //creation de la slash commande
        let command = new CommandBuilder(commande.name, desc, commande.typeCommand);
        let options = [];
        if (commande.optionInt) {
            for (const option of commande.optionInt) {
                options.push({
                    description: option.description,
                    name: option.name,
                    type: option.type,
                    max_value: option.max_value,
                    min_value: option.min_value,
                    required: option.required,
                    autocomplete: option.autocomplete,
                    choices: option.choices?.map(c => {
                        return {
                            name: c.name,
                            value: c.value
                        };
                    })
                });
            }
        }
        if (commande.optionString)
            for (const option of commande.optionString) {
                options.push({
                    description: option.description,
                    name: option.name,
                    type: option.type,
                    required: option.required,
                    autocomplete: option.autocomplete,
                    choices: option.choices?.map(c => {
                        return {
                            name: c.name,
                            value: c.value
                        };
                    })
                });
            }
        if (commande.optionUser)
            for (const option of commande.optionUser) {
                options.push({
                    description: option.description,
                    name: option.name,
                    type: option.type,
                    required: option.required,
                });
            }
        if (commande.admin) {
            command.setDefaultMemberPermission("0");
        }
        command.setOptions(options);
        Commands.push(command);
    }
    if (!(typeof process.env.TOKEN === 'string'))
        return;
    const clientId = bot.getID();
    if (!(typeof clientId === 'string'))
        return;
    const rest = new REST().setToken(bot.getToken());
    await (async () => {
        try {
            console.log(`Started refreshing ${Commands.length} application (/) SlashCommands.`);
            //permet au slash commande d'être visible sur le serveur
            console.log("guilds of bots :", guildIds);
            //load commands for every guild
            for (const guildId of guildIds) {
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: Commands });
            }
            console.log(`Successfully reloaded ${bot.commands.size} application (/) SlashCommands.`);
        }
        catch (error) {
            console.error("[ERROR] error while loading SlashCommands\n", error);
            throw error;
        }
    })();
};
export const loadCommandsOnServer = async (bot, guildId) => {
    const guildIds = [guildId];
    await setupLoad(bot, guildIds);
};
export const loadCommandsOnAllServers = async (bot) => {
    await bot.guilds.fetch();
    const guildIds = bot.guilds.cache.map(guild => guild.id);
    await setupLoad(bot, guildIds);
};
