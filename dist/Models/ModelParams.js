import { collections } from "../Connection/connection.js";
import { isListParams_t } from "../types/types.js";
export default class ModelParams {
    /**
     * Méthode permettant de savoir si le bot suit déjà un message.
     * @param messageId - l'id du message que le bot doit suivre les réactions
     * @return true si ce message n'est pas déjà suivie par le bot, false sinon
     * */
    static async doMessageAlreadyHaveRedirection(messageId) {
        const paramsCollection = await collections.params?.find({}).toArray();
        if (!isListParams_t(paramsCollection))
            return false;
        const messageIdSaved = paramsCollection.map((p) => {
            return p.messageId;
        });
        return messageIdSaved.includes(messageId);
    }
}
