import params from "../DBModels/params";
import {type} from "node:os";

export enum CollectorEndReason {
  TIME = "time",
  LIMIT = "limit",
  CHANNEL_DELETE = "channelDelete",
  MESSAGE_DELETE = "messageDelete",
  GUILD_DELETE = "guildDelete",
}

//a vraiment faire par la suite mais flemme
export function isParams_t(obj : unknown) : obj is params
{
    return obj != null && typeof obj === "object" && "redirectSalonId" in obj;
}

//a vraiment faire par la suite mais flemme
export function isListParams_t(obj : unknown) : obj is params[]
{
    return obj != null && Array.isArray(obj) && obj.every(v => isParams_t(v));
}
