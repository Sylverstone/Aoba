import {
    AutocompleteInteraction,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandStringOption,
    SlashCommandUserOption
} from "discord.js"
import { CommandType_t } from "../Loaders/LoadCommands"
import {CBot} from "../class/CBot";

export type script_t = 
{
    name : string,
    description : string,
    run : any,
    admin : boolean,
    howToUse? : string,
    typeCommand : CommandType_t,
    optionString? : SlashCommandStringOption[],
    optionInt? : SlashCommandIntegerOption[],
    optionUser? : SlashCommandUserOption[],
    optionChannel? : SlashCommandChannelOption[]
    autocomplete? : (bot : CBot, interaction : AutocompleteInteraction) => void,
}