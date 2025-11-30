import { Events, TextChannel, } from "discord.js";
import { isListParams_t } from "../types/types.js";
import ModelParams from "../Models/ModelParams.js";
export var EHandleReaction;
(function (EHandleReaction) {
    EHandleReaction[EHandleReaction["Suppression"] = 0] = "Suppression";
    EHandleReaction[EHandleReaction["Ajout"] = 1] = "Ajout";
})(EHandleReaction || (EHandleReaction = {}));
export async function handleReaction(bot, reaction, user, EHandleReact) {
    // if(reaction.partial)
    //     await reaction.fetch();
    //
    // if(user.partial)
    //     await user.fetch();
    const message = reaction.message;
    const collectionsParams = await ModelParams.getMessageFollowed({ guildId: message.guildId ?? "" });
    if (!isListParams_t(collectionsParams))
        return;
    const messageIdRegistered = collectionsParams.find((obj) => {
        return obj.messageId === message.id;
    });
    if (!messageIdRegistered)
        return;
    const { messageId, channelId, guildId } = messageIdRegistered;
    const salon = await message.guild?.channels.fetch(messageIdRegistered.redirectSalonId);
    if (!salon) {
        // le salon n'existe plus alors que le joueur l'a set, on supprimeee
        await ModelParams.deleteMessageFollow(messageId);
        return;
    }
    //le salon existe
    if (!salon.isSendable() || !(salon instanceof TextChannel))
        return;
    const messageReacted = reaction.message;
    if (messageReacted.partial)
        await messageReacted.fetch();
    const texte = EHandleReact === EHandleReaction.Ajout ?
        `${user} à réagit à ce [message](https://discord.com/channels/${guildId}/${channelId}/${messageId}) avec l'émoji - ${reaction.emoji.toString()}` :
        `${user} à supprimer sa réaction sur ce [message](https://discord.com/channels/${guildId}/${channelId}/${messageId}). Il avait mit l'émoji - ${reaction.emoji.toString()}`;
    return salon.send({
        embeds: [{
                title: "LOGS",
                color: 0xff6919,
                description: texte,
                fields: [
                    {
                        name: "Message",
                        value: messageReacted.content ?? "Aucune contenu"
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    icon_url: bot.user?.displayAvatarURL() ?? "",
                    text: "Au plaisir"
                }
            }
        ]
    });
}
const name = Events.MessageReactionAdd;
const exec = async (bot, reaction, user) => {
    await handleReaction(bot, reaction, user, EHandleReaction.Ajout);
};
export { name, exec };
