import * as path from "path";
import { ApplicationCommandOptionType, REST, Routes } from "discord.js";
import __dirname from "../dirname.js";
import "dotenv/config";
import { IsCustomCommandJson_t } from "../config/types.js";
import CommandBuilder from "../class/CommandBuilder.js";
import Utils from "../class/Utils.js";
import * as fs from "fs";
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
        let commandBuilder = new CommandBuilder(commande.name, desc, commande.typeCommand);
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
                    }),
                    max_length: option.max_length,
                    min_length: option.min_length,
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
        if (commande.optionBoolean)
            for (const option of commande.optionBoolean) {
                options.push({
                    description: option.description,
                    name: option.name,
                    type: option.type,
                    required: option.required,
                });
            }
        if (commande.customCommandHandler)
            commandBuilder.customCommandHandler = true;
        if (commande.admin) {
            commandBuilder.setDefaultMemberPermission("0");
        }
        commandBuilder.setOptions(options);
        Commands.push(commandBuilder);
    }
    const GuildCommandsMap = new Map();
    for (const [id] of guildIds) {
        const CopyCommands = [];
        for (const c of Commands) {
            CopyCommands.push(CommandBuilder.InstanceFromOtherCommandBuilder(c));
        }
        GuildCommandsMap.set(id, CopyCommands);
    }
    for (let [id, C] of GuildCommandsMap) {
        let guildName = guildIds.find(l => l.includes(id));
        console.log(guildName);
        const CustomCommandBuilder = C.find(c => c.customCommandHandler);
        console.log(CustomCommandBuilder);
        console.log(typeof CustomCommandBuilder);
        if (!CustomCommandBuilder)
            continue;
        if (!guildName)
            continue;
        const customCommands = await GetGuildCustomCommands(bot, id, guildName[1]);
        if (!customCommands) {
            C = C.filter(f => f !== CustomCommandBuilder);
            GuildCommandsMap.set(id, C);
            continue;
        }
        C = C.filter(commandBuilder => commandBuilder !== CustomCommandBuilder);
        CustomCommandBuilder.pushOptions(customCommands);
        C.push(CustomCommandBuilder);
        GuildCommandsMap.set(id, C);
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
            // const customCommandModel = new ModelCustomCommand();
            // await customCommandModel.connect();
            //load commands for every guild
            for (const [guildId, guildName] of guildIds) {
                console.log("iter");
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: GuildCommandsMap.get(guildId) });
            }
            // await customCommandModel.close();
            console.log(`Successfully reloaded ${bot.commands.size} application (/) SlashCommands.`);
        }
        catch (error) {
            console.error("[ERROR] error while loading SlashCommands\n", error);
            throw error;
        }
    })();
};
export const loadCommandsOnServer = async (bot, guildId) => {
    await bot.guilds.fetch();
    const guild = bot.guilds.cache.find(g => g.id === guildId);
    if (!guild)
        return;
    const guildIds = [[guildId, guild.name]];
    await setupLoad(bot, guildIds);
};
export const loadCommandsOnAllServers = async (bot) => {
    await bot.guilds.fetch();
    const guildIds = bot.guilds.cache.map(guild => [guild.id, guild.name]);
    await setupLoad(bot, guildIds);
};
export const addCommand = async (bot, guildId, commandName, commandDescription) => {
    let command = new CommandBuilder(commandName, commandDescription, CommandType_t.CHAT_INPUT);
    const clientId = bot.getID();
    if (!(typeof clientId === 'string'))
        return;
    const rest = new REST().setToken(bot.getToken());
    await (async () => {
        try {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [command] });
        }
        catch (error) {
            console.error("[ERROR] error while loading SlashCommands\n", error);
        }
    })();
};
export const GetGuildCustomCommands = async (bot, guildId, guildName) => {
    const JSONDataFilePath = path.join(__dirname, "..", "data", Utils.GenerateCollectionName(guildId, guildName) + ".json");
    if (!fs.existsSync(JSONDataFilePath)) {
        console.log(`${JSONDataFilePath} n'existe pas !)`);
        return null;
    }
    const JSONData = JSON.parse(fs.readFileSync(JSONDataFilePath).toString());
    if (!IsCustomCommandJson_t(JSONData))
        return null;
    const guildCustomCommands = JSONData.commands;
    const options = [];
    for (const commands of guildCustomCommands) {
        const { name, description } = commands;
        options.push({
            name: name,
            type: ApplicationCommandOptionType.Subcommand,
            description: description,
        });
    }
    //command.setOptions(options);
    return options;
    // const clientId : string | undefined = bot.getID();
    // if(!(typeof clientId === 'string')) return;
    // const rest = new REST().setToken(bot.getToken());
    //
    // await (async () => {
    //         try {
    //             await rest.put(
    //                 Routes.applicationGuildCommands(clientId, guildId),
    //                 {body: [command]},
    //             );
    //         }
    //         catch (error) {
    //             console.error("[ERROR] error while loading SlashCommands\n", error);
    //         }
    //     }
    // )();
};
