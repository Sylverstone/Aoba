import { ApplicationCommandType } from "discord-api-types/v10";
export var OptionType_t;
(function (OptionType_t) {
    OptionType_t[OptionType_t["BOOL"] = 5] = "BOOL";
    OptionType_t[OptionType_t["STRING"] = 3] = "STRING";
    OptionType_t[OptionType_t["INTEGER"] = 4] = "INTEGER";
    OptionType_t[OptionType_t["USER"] = 6] = "USER";
})(OptionType_t || (OptionType_t = {}));
export var CommandType_t;
(function (CommandType_t) {
    CommandType_t[CommandType_t["USERCOMMAND"] = 2] = "USERCOMMAND";
    CommandType_t[CommandType_t["CHAT_INPUT"] = 1] = "CHAT_INPUT";
    CommandType_t[CommandType_t["MESSAGE_COMMAND"] = 3] = "MESSAGE_COMMAND";
})(CommandType_t || (CommandType_t = {}));
const MyCommandToApplicationCommand_t = (t) => {
    switch (t) {
        case CommandType_t.CHAT_INPUT:
            return ApplicationCommandType.ChatInput;
        case CommandType_t.USERCOMMAND:
            return ApplicationCommandType.User;
        case CommandType_t.MESSAGE_COMMAND:
            return ApplicationCommandType.Message;
    }
};
/**
 * Class permettant de créer des commandes, que ce soit des SlashCommand, UserCommand, ou MessageCommand
 * */
export default class CommandBuilder {
    getCommand() {
        return this.command;
    }
    constructor(name, desc, type) {
        this.command = {
            name: "",
            description: "",
            type: CommandType_t.MESSAGE_COMMAND
        };
        this.customCommandHandler = false;
        this.command.name = name;
        this.command.description = desc;
        this.command.type = type;
    }
    static InstanceFromOtherCommandBuilder(other) {
        const _new = new CommandBuilder(other.getCommand().name, other.getCommand().description, other.getCommand().type);
        const memberPerm = other.getCommand().default_member_permissions;
        if (memberPerm)
            _new.setDefaultMemberPermission(memberPerm);
        const options = other.getCommand().options;
        if (options)
            _new.setOptions([...options]);
        _new.customCommandHandler = other.customCommandHandler;
        return _new;
    }
    setDefaultMemberPermission(defaultMemberPermission) {
        this.command.default_member_permissions = defaultMemberPermission;
    }
    setOptions(options) {
        this.command.options = options;
    }
    pushOptions(options) {
        this.command.options?.push(...options);
    }
    toJSON() {
        return {
            name: this.command.name,
            description: this.command.description,
            options: this.command.options,
            default_member_permissions: this.command.default_member_permissions,
            type: MyCommandToApplicationCommand_t(this.command.type)
        };
    }
}
