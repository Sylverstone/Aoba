import {AutocompleteInteraction, ChatInputCommandInteraction} from "discord.js";

export default function GetGuildIDAndGuildName(interaction : ChatInputCommandInteraction | AutocompleteInteraction)
{
    const guildName = interaction.guild?.name;
    const guildId = interaction.guild?.id;

    if(!guildName || !guildId)
        return {guildName :"",guildId :""};

    return {guildName, guildId};
}