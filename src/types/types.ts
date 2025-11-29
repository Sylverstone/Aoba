import params from "../DBModels/params";

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
    return true;
}

//a vraiment faire par la suite mais flemme
export function isListParams_t(obj : unknown) : obj is params[]
{
    return true;
}
