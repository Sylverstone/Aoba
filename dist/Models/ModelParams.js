import { CustomMongoClient } from "../Connection/connection.js";
import { isListParams_t } from "../types/types.js";
import getAllowConnection from "../Utils/getAllowConnection.js";
/**
 * Class faisant la liaison avec la base de donnée mongoDb, plus particulièrement la base ParamsDB avec la collection (table) ReactionRedirectionParams.
 * La class gère également la fermeture et ouverture automatique de la connection à mongoDB pour éviter de laisser la connection ouverte. (utile pour le serverless de railway)
 */
class ModelParams {
    static async closeConnection() {
        try {
            await ModelParams.db.close(true);
            ModelParams.active = false;
            return true;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Méthode qui initialise la connection à la base de donnée mongoDB. Elle lance également l'interval qui contrôle la connection la première fois qu'elle est lancé
     * */
    static async initConnection() {
        ModelParams.db = new CustomMongoClient(process.env.DB_URL ?? "");
        await ModelParams.db.connect();
        ModelParams.lastUse = new Date();
        ModelParams.active = true;
        console.log("[DB] La connection à la base de donnée a été ouverte.");
        if (!ModelParams.intervalActive) {
            ModelParams.intervalActive = true;
            setInterval(async () => {
                console.log("[CONNECTION] verification de la connection");
                if (!ModelParams.active)
                    return;
                console.log("[CONNECTION] La connection est active");
                const now = new Date().getTime();
                const lastUseNow = ModelParams.lastUse.getTime();
                console.log("[CONNECTION] Cela fait " + (now - lastUseNow) / 1000 + "s qu'elle n'a pas été utilisé");
                if (now - lastUseNow >= 2 * 1000 * 60) {
                    ModelParams.active = false;
                    await ModelParams.db.close(true);
                    console.log("[DB] La connection à la base de donnée a été fermé.");
                }
            }, ModelParams.timeInterval);
        }
    }
    /**
     * Méthode permettant de savoir si le bot suit déjà un message.
     * @param messageId - l'id du message que le bot doit suivre les réactions
     * @param guildId - l'id de la guild
     * @return true si ce message n'est pas déjà suivie par le bot, false sinon
     * */
    static async doMessageAlreadyHaveRedirection(messageId, guildId) {
        if (getAllowConnection() != "oui") {
            return null;
        }
        try {
            if (!ModelParams.active) {
                await ModelParams.initConnection();
            }
            else
                ModelParams.lastUse = new Date();
            const Query = { guildId: guildId ?? "" };
            const paramsCollection = await ModelParams.db.getCollections().params?.find(Query).toArray();
            if (!isListParams_t(paramsCollection))
                return false;
            const messageIdSaved = paramsCollection.map((p) => {
                return p.messageId;
            });
            return messageIdSaved.includes(messageId);
        }
        catch (err) {
            return null;
        }
    }
    /**
     * Méthode pour supprimer un message des suivies du bot
     * @param messageId - l'id du message que le bot ne doit plus suivre
     * @return true si le delete à eu lieu, false sinon, null si il y a eu un problème dans la bdd
     * */
    static async deleteMessageFollow(messageId) {
        if (getAllowConnection() != "oui") {
            return null;
        }
        if (!ModelParams.active) {
            await ModelParams.initConnection();
        }
        else
            ModelParams.lastUse = new Date();
        try {
            const Query = { messageId: messageId };
            const DeleteResult = await ModelParams.db.getCollections().params?.deleteMany(Query);
            return (DeleteResult?.deletedCount ?? 0) > 0;
        }
        catch (err) {
            return null;
        }
    }
    static async addMessageFollow(messageId, guildId, channelId, redirectChannelId) {
        if (getAllowConnection() != "oui") {
            return null;
        }
        if (!ModelParams.active)
            await ModelParams.initConnection();
        else
            ModelParams.lastUse = new Date();
        try {
            const params = {
                redirectSalonId: redirectChannelId,
                messageId: messageId,
                guildId: guildId,
                channelId: channelId
            };
            await ModelParams.db.getCollections().params?.insertOne(params);
            return true;
        }
        catch (err) {
            return null;
        }
    }
    static async getMessageFollowed(Query) {
        if (getAllowConnection() != "oui") {
            return null;
        }
        if (!ModelParams.active)
            await ModelParams.initConnection();
        else
            ModelParams.lastUse = new Date();
        try {
            return ModelParams.db.getCollections().params?.find(Query).toArray();
        }
        catch (err) {
            return null;
        }
    }
}
ModelParams.active = false;
ModelParams.intervalActive = false;
ModelParams.timeInterval = 1 * 1000 * 60;
export default ModelParams;
