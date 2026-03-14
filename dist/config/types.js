export function IsCustomCommand_t(u) {
    return u != null && typeof u === "object" && "name" in u && "description" in u && "value" in u;
}
export function IsCustomCommandList_t(u) {
    return u != null && Array.isArray(u) && u.every(o => IsCustomCommand_t(o));
}
export function IsCustomCommandJson_t(u) {
    return u != null && typeof u === "object" && "commands" in u;
}
