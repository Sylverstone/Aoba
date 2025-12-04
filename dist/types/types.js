export var CollectorEndReason;
(function (CollectorEndReason) {
    CollectorEndReason["TIME"] = "time";
    CollectorEndReason["LIMIT"] = "limit";
    CollectorEndReason["CHANNEL_DELETE"] = "channelDelete";
    CollectorEndReason["MESSAGE_DELETE"] = "messageDelete";
    CollectorEndReason["GUILD_DELETE"] = "guildDelete";
})(CollectorEndReason || (CollectorEndReason = {}));
//a vraiment faire par la suite mais flemme
export function isParams_t(obj) {
    return obj != null && typeof obj === "object" && "redirectSalonId" in obj;
}
//a vraiment faire par la suite mais flemme
export function isListParams_t(obj) {
    return obj != null && Array.isArray(obj) && obj.every(v => isParams_t(v));
}
