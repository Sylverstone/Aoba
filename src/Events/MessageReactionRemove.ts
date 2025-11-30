import {
    ButtonInteraction,
    CommandInteraction,
    Events, MessageCreateOptions,
    MessageFlags, MessageReaction, PartialMessageReaction, PartialUser,
    TextChannel, User,
} from "discord.js"
import {CBot} from "../class/CBot.js";

import {EHandleReaction, handleReaction} from "./MessageReactionAdd.js";


const name = Events.MessageReactionRemove;


const exec = async (bot : CBot, reaction : MessageReaction | PartialMessageReaction, user : User | PartialUser  ) =>  {

    await handleReaction(bot,reaction,user,EHandleReaction.Suppression);
}

export{name,exec}
