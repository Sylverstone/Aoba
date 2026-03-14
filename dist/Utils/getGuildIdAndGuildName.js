export default function GetGuildIDAndGuildName(interaction) {
    const guildName = interaction.guild?.name;
    const guildId = interaction.guild?.id;
    if (!guildName || !guildId)
        return { guildName: "", guildId: "" };
    return { guildName, guildId };
}
