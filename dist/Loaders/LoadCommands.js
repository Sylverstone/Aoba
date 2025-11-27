import { readdirSync } from "fs";
import * as path from "path";
import { REST, Routes } from "discord.js";
import __dirname from "../dirname.js";
import { pathToFileURL } from "url";
import "dotenv/config";
export const getFile = async (fileUrl) => {
    const module = await import(fileUrl);
    return module.default;
};
export var OptionType_t;
(function (OptionType_t) {
    OptionType_t[OptionType_t["BOOL"] = 5] = "BOOL";
    OptionType_t[OptionType_t["STRING"] = 3] = "STRING";
    OptionType_t[OptionType_t["INTEGER"] = 4] = "INTEGER";
    OptionType_t[OptionType_t["USER"] = 6] = "USER";
})(OptionType_t || (OptionType_t = {}));
export var CommandType_t;
(function (CommandType_t) {
    CommandType_t[CommandType_t["USERCOMMAND"] = 2] = "USERCOMMAND";
    CommandType_t[CommandType_t["CHAT_INPUT"] = 1] = "CHAT_INPUT";
    CommandType_t[CommandType_t["MESSAGE_COMMAND"] = 3] = "MESSAGE_COMMAND";
})(CommandType_t || (CommandType_t = {}));
const setupLoad = async (bot, guildIds) => {
    console.log(guildIds);
    console.log("guild");
    const ext = ".js";
    const listeFileCommands = readdirSync(path.join(__dirname, "Commands"))
        .filter(file => file.endsWith(ext))
        .map(file => path.join(__dirname, "Commands", file));
    let Commands = [];
    for (const file of listeFileCommands) {
        const fileUrl = pathToFileURL(file).href;
        const commande = await getFile(fileUrl);
        bot.commands.set(commande.name, commande);
        const desc = commande.typeCommand === CommandType_t.CHAT_INPUT ? commande.description : "";
        //creation de la slash commande
        let userCommand = {
            name: commande.name,
            type: commande.typeCommand,
            description: desc
        };
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
        if (commande.admin)
            userCommand.default_member_permissions = "0";
        userCommand.options = options;
        Commands.push(userCommand);
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
            console.log(`Successfully reloaded ${listeFileCommands.length} application (/) SlashCommands.`);
        }
        catch (error) {
            console.error("[ERROR] error while loading SlashCommands\n", error);
            throw error;
        }
    })();
};
export const loadUserCommandOnServer = async (bot, guildId) => {
    const guildIds = [guildId];
    await setupLoad(bot, guildIds);
};
export const loadUserCommandsOnAllServers = async (bot) => {
    await bot.guilds.fetch();
    const guildIds = bot.guilds.cache.map(guild => guild.id);
    await setupLoad(bot, guildIds);
};
