import * as mongodb from "mongodb";
import {collections_t,collections} from "../Connection/connection.js";
import {isListParams_t, isParams_t} from "../types/types.js";
import params from "../DBModels/params.js";

export default class ModelParams
{

    /**
     * Méthode permettant de savoir si le bot suit déjà un message.
     * @param messageId - l'id du message que le bot doit suivre les réactions
     * @return true si ce message n'est pas déjà suivie par le bot, false sinon
     * */
    public static async doMessageAlreadyHaveRedirection(messageId : string)
    {
        const paramsCollection = await collections.params?.find({}).toArray();
        if(!isListParams_t(paramsCollection))
            return false;

        const messageIdSaved = paramsCollection.map((p : params) => {
            return p.messageId;
        });

        return messageIdSaved.includes(messageId);
    }
}