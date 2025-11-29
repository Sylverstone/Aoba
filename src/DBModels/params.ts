import { ObjectId } from "mongodb";


interface Params
{
    guildId : string,
    messageId : string,
    redirectSalonId : string,
    channelId : string,
    id? : ObjectId
}

export type ParamsQuery_t = Partial<Params>;

export default Params;