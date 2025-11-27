import { readdirSync } from "fs";
import  * as path from "path";
import {REST, Routes } from "discord.js";
import __dirname from "../dirname.js";
import { pathToFileURL } from "url";
import {CBot} from "../class/CBot.js";
import "dotenv/config"
import { script_t } from "../config/types.js";

export const getFile = async(fileUrl : string) : Promise<script_t> =>
{
    const module = await import(fileUrl);
    return module.default;
}

export enum OptionType_t
{
    BOOL = 5,
    STRING = 3,
    INTEGER = 4,
    USER = 6
}

export enum CommandType_t
{
    USERCOMMAND = 2,
    CHAT_INPUT = 1,
    MESSAGE_COMMAND = 3
}
type choices_t = 
{
    name : string,
    value : number | string
}
interface option_t 
{
    name : string,
    type : number,
    description : string,
    required? : boolean,
    choices? : choices_t[],
    max_value? : number,
    min_value? : number,
}

type userCommand_t = 
{
    name : string
    type : CommandType_t,
    description : string,
    default_member_permissions? : string,
    options? : option_t[],
}

const setupLoad = async (bot : CBot, guildIds : string[]) =>
{
    console.log(guildIds);
    console.log("guild");
    const ext = ".js";
    const listeFileCommands = readdirSync(path.join(__dirname,"Commands"))
        .filter(file => file.endsWith(ext))
        .map(file => path.join(__dirname,"Commands", file));

    
    let Commands : Array<userCommand_t> = [];
    for(const file of listeFileCommands)
    {
        const fileUrl = pathToFileURL(file).href
        
        const commande : script_t = await getFile(fileUrl);

        bot.commands.set(commande.name, commande);

        const desc = commande.typeCommand === CommandType_t.CHAT_INPUT ? commande.description : "";
        //creation de la slash commande
        let userCommand : userCommand_t = {
            name : commande.name,
            type : commande.typeCommand,
            description : desc
        }

        let options : option_t[] = [];

        if(commande.optionInt)
        {
            
            for(const option of commande.optionInt)
            {
                options.push({
                    description : option.description,
                    name : option.name,
                    type : option.type,
                    max_value : option.max_value,
                    min_value : option.min_value,
                    required : option.required,
                    choices : option.choices?.map(c => {
                        return {
                            name : c.name,
                            value : c.value
                        }
                    })
                })
            }
        }

        if(commande.optionString)
            for(const option of commande.optionString)
            {
                options.push({
                    description : option.description,
                    name : option.name,
                    type : option.type,
                    required : option.required,
                    choices : option.choices?.map(c => {
                        return {
                            name : c.name,
                            value : c.value
                        }
                    })
                })
            }
        
        if(commande.optionUser)
            for(const option of commande.optionUser)
            {
                options.push({
                    description : option.description,
                    name : option.name,
                    type : option.type,
                    required : option.required,
                })
            }

        if(commande.admin)
            userCommand.default_member_permissions = "0";

        userCommand.options = options;
        Commands.push(userCommand);
    }

    if(!(typeof process.env.TOKEN === 'string')) return;
    
    const clientId : string | undefined = bot.getID();
    if(!(typeof clientId === 'string')) return;
    const rest = new REST().setToken(bot.getToken());
    
    await (async () => {
        try {
            console.log(`Started refreshing ${Commands.length} application (/) SlashCommands.`);
            //permet au slash commande d'être visible sur le serveur
            console.log("guilds of bots :", guildIds);
            //load commands for every guild
            for(const guildId of guildIds)
            {

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: Commands },
                );
            }
            console.log(`Successfully reloaded ${listeFileCommands.length} application (/) SlashCommands.`);
        }catch (error) {
            console.error("[ERROR] error while loading SlashCommands\n", error);
            throw error;
        }
    })();
}

export const loadUserCommandOnServer = async (bot : CBot, guildId : string) =>
{
    const guildIds = [guildId];
    await setupLoad(bot, guildIds);
}

export const loadUserCommandsOnAllServers = async (bot : CBot)=> 
{
    await bot.guilds.fetch();
    const guildIds = bot.guilds.cache.map(guild => guild.id);
    await setupLoad(bot,guildIds);
}