import { ObjectId } from "mongodb";


interface Params
{
    guildId : string,
    messageId : string,
    redirectSalonId : string,
    channelId : string,
    id? : ObjectId
}

export default Params;