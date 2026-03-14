export default class Utils {
    static GenerateCollectionName(guildId, guildName) {
        return `${guildName}${guildId}`.toLowerCase();
    }
}
