export default class Utils
{
    public static GenerateCollectionName(guildId : string, guildName : string)
    {
        return `${guildName}${guildId}`.toLowerCase();
    }
}