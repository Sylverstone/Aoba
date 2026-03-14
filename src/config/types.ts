import {
    AutocompleteInteraction, SlashCommandBooleanOption, SlashCommandBuilder,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandStringOption, SlashCommandSubcommandBuilder,
    SlashCommandUserOption
} from "discord.js"
import { CommandType_t } from "../Loaders/LoadCommands"
import {CBot} from "../class/CBot";
import {type} from "node:os";

export type script_t = 
{
    name : string,
    description : string,
    run : any,
    admin : boolean,
    howToUse? : string,
    typeCommand : CommandType_t,
    optionString? : SlashCommandStringOption[],
    optionBoolean? : SlashCommandBooleanOption[],
    optionInt? : SlashCommandIntegerOption[],
    optionUser? : SlashCommandUserOption[],
    optionChannel? : SlashCommandChannelOption[],

    customCommandHandler? : boolean,
    autocomplete? : (bot : CBot, interaction : AutocompleteInteraction) => void,
}

export interface customCommand_t
{
    name : string,
    description : string,
    value : string,
    message_ephemere? : boolean;
}

export function IsCustomCommand_t(u : unknown) : u is customCommand_t
{
    return u != null && typeof u === "object" && "name" in u&& "description" in u && "value" in u;
}

export function IsCustomCommandList_t(u : unknown): u is customCommand_t[]
{
    return u != null && Array.isArray(u) && u.every(o => IsCustomCommand_t(o));
}

export interface CustomCommandJson_t
{
    commands : CustomCommandData[]
}

export interface CustomCommandData
{
    name : string,
    value : string,
    description : string,
    message_ephemere? : boolean,
}

export function IsCustomCommandJson_t(u : unknown): u is CustomCommandJson_t{
    return u != null && typeof u === "object" && "commands" in u;
}