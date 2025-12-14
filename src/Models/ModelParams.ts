import * as mongodb from "mongodb";
import {collections_t, CustomMongoClient} from "../Connection/connection.js";
import {isListParams_t} from "../types/types.js";
import params, {ParamsQuery_t} from "../DBModels/params.js";
import Params from "../DBModels/params.js";
import getAllowConnection from "../Utils/getAllowConnection.js";

/**
 * Class faisant la liaison avec la base de donnée mongoDb, plus particulièrement la base ParamsDB avec la collection (table) ReactionRedirectionParams.
 * La class gère également la fermeture et ouverture automatique de la connection à mongoDB pour éviter de laisser la connection ouverte. (utile pour le serverless de railway)
 */
export default class ModelParams
{

    private static db : CustomMongoClient;
    private static lastUse : Date;
    private static active : boolean = false;
    private static intervalActive : boolean = false;
    private static timeInterval : number = 1 * 1000 * 60;


    public static async closeConnection()
    {
        try {
            await ModelParams.db.close(true);
            ModelParams.active = false;
            return true;
        }
        catch(err)
        {
            return false;
        }
    }

    /**
     * Méthode qui initialise la connection à la base de donnée mongoDB. Elle lance également l'interval qui contrôle la connection la première fois qu'elle est lancé
     * */
    public static async initConnection()
    {

        ModelParams.db = new CustomMongoClient(process.env.DB_URL ?? "");
        await ModelParams.db.connect();
        ModelParams.lastUse = new Date();
        ModelParams.active = true;
        console.log("[DB] La connection à la base de donnée a été ouverte.");

        if(!ModelParams.intervalActive)
        {
            ModelParams.intervalActive = true;
            setInterval(async() => {
                console.log("[CONNECTION] verification de la connection");
                if(!ModelParams.active)
                    return;

                console.log("[CONNECTION] La connection est active");
                const now = new Date().getTime();
                const lastUseNow = ModelParams.lastUse.getTime();

                console.log("[CONNECTION] Cela fait " + (now - lastUseNow) / 1000 + "s qu'elle n'a pas été utilisé");
                if(now - lastUseNow >= 2 * 1000 * 60)
                {
                    ModelParams.active = false;
                    await ModelParams.db.close(true);
                    console.log("[DB] La connection à la base de donnée a été fermé.");
                }
            },ModelParams.timeInterval);
        }
    }

    /**
     * Méthode permettant de savoir si le bot suit déjà un message.
     * @param messageId - l'id du message que le bot doit suivre les réactions
     * @param guildId - l'id de la guild
     * @return true si ce message n'est pas déjà suivie par le bot, false sinon
     * */
    public static async doMessageAlreadyHaveRedirection(messageId : string, guildId : string)
    {
        if(getAllowConnection() != "oui")
        {
            return null;
        }

        try {
            if(!ModelParams.active)
            {
                await ModelParams.initConnection();
            }
            else
                ModelParams.lastUse = new Date();

            const Query : ParamsQuery_t = { guildId : guildId ?? "" };

            const paramsCollection = await ModelParams.db.getCollections().params?.find(Query).toArray();
            if(!isListParams_t(paramsCollection))
                return false;

            const messageIdSaved = paramsCollection.map((p : params) => {
                return p.messageId;
            });

            return messageIdSaved.includes(messageId);
        }
        catch (err)
        {
            return null;
        }

    }

    /**
     * Méthode pour supprimer un message des suivies du bot
     * @param messageId - l'id du message que le bot ne doit plus suivre
     * @return true si le delete à eu lieu, false sinon, null si il y a eu un problème dans la bdd
     * */
    public static async deleteMessageFollow(messageId : string) : Promise<boolean | null>
    {
        if(getAllowConnection() != "oui")
        {
            return null;
        }

        if(!ModelParams.active)
        {
            await ModelParams.initConnection();
        }
        else
            ModelParams.lastUse = new Date();

        try {
            const Query : ParamsQuery_t = { messageId : messageId};
            const DeleteResult = await ModelParams.db.getCollections().params?.deleteMany(Query);
            return (DeleteResult?.deletedCount ?? 0) > 0;
        }
        catch (err)
        {
            return null;
        }

    }

    public static async addMessageFollow(messageId : string, guildId : string, channelId : string, redirectChannelId : string)
    {
        if(getAllowConnection() != "oui")
        {
            return null;
        }

        if(!ModelParams.active)
            await ModelParams.initConnection();
        else
            ModelParams.lastUse = new Date();

        try {

            const params : Params = {
                redirectSalonId : redirectChannelId,
                messageId : messageId,
                guildId : guildId,
                channelId : channelId
            }

            await ModelParams.db.getCollections().params?.insertOne(params);

            return true;
        }
        catch (err)
        {
            return null;
        }

    }

    public static async getMessageFollowed(Query : ParamsQuery_t){

        if(getAllowConnection() != "oui")
        {
            return null;
        }
        if(!ModelParams.active)
            await ModelParams.initConnection();
        else
            ModelParams.lastUse = new Date();

        try {
            return ModelParams.db.getCollections().params?.find(Query).toArray();
        }
        catch (err)
        {
            return null;
        }
    }
}