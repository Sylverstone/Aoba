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
    return true;
}
//a vraiment faire par la suite mais flemme
export function isListParams_t(obj) {
    return true;
}
