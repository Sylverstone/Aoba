import * as mongodb from "mongodb";
import {collections_t,collections} from "../Connection/connection.js";
import {isListParams_t, isParams_t} from "../types/types.js";
import params, {ParamsQuery_t} from "../DBModels/params.js";

export default class ModelParams
{

    /**
     * Méthode permettant de savoir si le bot suit déjà un message.
     * @param messageId - l'id du message que le bot doit suivre les réactions
     * @param guildId - l'id de la guild
     * @return true si ce message n'est pas déjà suivie par le bot, false sinon
     * */
    public static async doMessageAlreadyHaveRedirection(messageId : string, guildId : string)
    {
        const Query : ParamsQuery_t = { guildId : guildId ?? "" };
        const paramsCollection = await collections.params?.find(Query).toArray();
        if(!isListParams_t(paramsCollection))
            return false;

        const messageIdSaved = paramsCollection.map((p : params) => {
            return p.messageId;
        });

        return messageIdSaved.includes(messageId);
    }

    /**
     * Méthode pour supprimer un message des suivies du bot
     * @param messageId - l'id du message que le bot ne doit plus suivre
     * @return true si le delete à eu lieu, false sinon, null si il y a eu un problème dans la bdd
     * */
    public static async deleteMessageFollow(messageId : string) : Promise<boolean | null>
    {
        try {
            const Query : ParamsQuery_t = { messageId : messageId};
            const DeleteResult = await collections.params?.deleteMany(Query);
            return (DeleteResult?.deletedCount ?? 0) > 0;
        }
        catch (err)
        {
            return null;
        }
    }
}