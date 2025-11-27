import {
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandStringOption,
    SlashCommandUserOption
} from "discord.js"
import { CommandType_t } from "../Loaders/LoadCommands"

export type script_t = 
{
    name : string,
    description : string,
    run : any,
    admin : boolean,
    typeCommand : CommandType_t,
    optionString? : SlashCommandStringOption[],
    optionInt? : SlashCommandIntegerOption[],
    optionUser? : SlashCommandUserOption[],
    optionChannel? : SlashCommandChannelOption[]
}