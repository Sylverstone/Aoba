import {
    ButtonInteraction,
    CommandInteraction,
    Events, MessageCreateOptions,
    MessageFlags, MessageReaction, PartialMessageReaction, PartialUser,
    TextChannel, User,
} from "discord.js"
import {CBot} from "../class/CBot.js";

import {isListParams_t} from "../types/types.js";
import params from "../DBModels/params.js";


const name = Events.MessageReactionAdd;


const exec = async (bot : CBot, reaction : MessageReaction | PartialMessageReaction, user : User | PartialUser  ) =>  {

    // if(reaction.partial)
    //     await reaction.fetch();
    //
    // if(user.partial)
    //     await user.fetch();

    const message = reaction.message;
    const collectionsParams = await bot.collections.params?.find({}).toArray()
    if(!isListParams_t(collectionsParams))
        return;

    const messageIdRegistered = collectionsParams.find((obj : params) => {
        return obj.messageId === message.id
    });


    if(!messageIdRegistered)
        return;

    const { messageId, channelId, guildId} = messageIdRegistered;

    const salon = await message.guild?.channels.fetch(messageIdRegistered.redirectSalonId);
    if(!salon)
    {
        // le salon n'existe plus alors que le joueur l'a set, on supprimeee
        const query = { messageId : message.id };
        await bot.collections.params?.deleteMany(query);
        return;
    }
    //le salon existe
    if(!salon.isSendable() || !(salon instanceof TextChannel))
        return;

    const messageReacted = reaction.message;
    if(messageReacted.partial)
        await messageReacted.fetch();

    return salon.send({
        embeds : [{
            title : "LOGS",
            color : 0xff6919,
            description : `${user} à réagit à ce [message](https://discord.com/channels/${guildId}/${channelId}/${messageId}) avec l'émoji - ${reaction.emoji.toString()}`
            ,

            fields : [
                {
                    name : "Message",
                    value : messageReacted.content ?? "Aucune contenu"
                }
            ],

            timestamp : new Date().toISOString(),

            footer : {
                icon_url : bot.user?.displayAvatarURL() ?? "",
                text: "Au plaisir"
            }
        }
        ]}
    );
}

export{name,exec}
