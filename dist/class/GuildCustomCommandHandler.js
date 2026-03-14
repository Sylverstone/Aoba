import path from "node:path";
import Utils from "./Utils.js";
import fs from "fs";
import { promises as fsp } from "fs";
import { IsCustomCommandJson_t } from "../config/types.js";
import { loadCommandsOnServer } from "../Loaders/LoadCommands.js";
import __dirname from "../dirname.js";
export default class GuildCustomCommandHandler {
    constructor(guildCustomCommandFilePath, guildId, bot) {
        this.FilePath = "";
        this.FilePath = guildCustomCommandFilePath;
        const content = fs.readFileSync(guildCustomCommandFilePath).toString();
        const JSONData = JSON.parse(content);
        if (!IsCustomCommandJson_t(JSONData))
            throw new Error("");
        this.GuildCustomCommandJSON = JSONData;
        this.guildId = guildId;
        this.bot = bot;
    }
    static async GetGuildCustomCommandHandler(guildId, bot) {
        try {
            await bot.guilds.fetch();
            const guildName = bot.guilds.cache.find(g => g.id === guildId)?.name;
            if (!guildName) {
                console.log(bot.guilds.cache);
                return null;
            }
            const CustomCommandJSONFilePath = path.join(__dirname, "..", "data", Utils.GenerateCollectionName(guildId, guildName) + ".json");
            if (!fs.existsSync(CustomCommandJSONFilePath)) {
                fs.writeFileSync(CustomCommandJSONFilePath, "{ \"commands\" : [] }");
            }
            return new GuildCustomCommandHandler(CustomCommandJSONFilePath, guildId, bot);
        }
        catch (err) {
            return null;
        }
    }
    GetGuildCustomCommands() {
        return this.GuildCustomCommandJSON;
    }
    GetGuildCustomCommandsName() {
        return this.GuildCustomCommandJSON.commands.map(command => command.name);
    }
    async RemoveCustomCommand(commandName) {
        try {
            const oldCommands = this.GuildCustomCommandJSON.commands;
            this.GuildCustomCommandJSON.commands = this.GuildCustomCommandJSON.commands.filter(command => command.name !== commandName);
            await this.SaveCustomCommand();
            return oldCommands.length !== this.GuildCustomCommandJSON.commands.length;
        }
        catch (err) {
            return null;
        }
    }
    async AddCustomCommand(command) {
        try {
            if (this.GetGuildCustomCommandsName().includes(command.name))
                return false;
            this.GuildCustomCommandJSON.commands.push(command);
            await this.SaveCustomCommand();
            return true;
        }
        catch (err) {
            return null;
        }
    }
    async RemoveLastCommand() {
        try {
            this.GuildCustomCommandJSON.commands.pop();
            await this.SaveCustomCommand();
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async SaveCustomCommand() {
        await fsp.writeFile(this.FilePath, JSON.stringify(this.GuildCustomCommandJSON, null, 4));
        await loadCommandsOnServer(this.bot, this.guildId);
    }
}
