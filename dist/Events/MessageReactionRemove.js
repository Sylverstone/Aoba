import { Events, } from "discord.js";
import { EHandleReaction, handleReaction } from "./MessageReactionAdd.js";
const name = Events.MessageReactionRemove;
const exec = async (bot, reaction, user) => {
    await handleReaction(bot, reaction, user, EHandleReaction.Suppression);
};
export { name, exec };
