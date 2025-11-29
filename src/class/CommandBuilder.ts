import {ApplicationCommandType, RESTPostAPIApplicationCommandsJSONBody} from "discord-api-types/v10"

export enum OptionType_t
{
    BOOL = 5,
    STRING = 3,
    INTEGER = 4,
    USER = 6
}

export enum CommandType_t
{
    USERCOMMAND = 2,
    CHAT_INPUT = 1,
    MESSAGE_COMMAND = 3
}

const MyCommandToApplicationCommand_t = (t : CommandType_t) => {
    switch (t)
    {
        case CommandType_t.CHAT_INPUT:
            return ApplicationCommandType.ChatInput;
        case CommandType_t.USERCOMMAND:
            return ApplicationCommandType.User;

        case CommandType_t.MESSAGE_COMMAND:
            return ApplicationCommandType.Message;
    }
}

type choices_t =
{
    name : string,
    value : number | string
}

interface option_t
{
    name : string,
    type : number,
    description : string,
    required? : boolean,
    choices? : choices_t[],
    max_value? : number,
    min_value? : number,
    autocomplete? : boolean,
}

type userCommand_t =
{
    name : string
    type : CommandType_t,
    description : string,
    default_member_permissions? : string,
    options? : option_t[],
}

/**
 * Class permettant de créer des commandes, que ce soit des SlashCommand, UserCommand, ou MessageCommand
 * */
export default class CommandBuilder {

    private command : userCommand_t = {
        name : "",
        description : "",
        type : CommandType_t.MESSAGE_COMMAND
    };

    public constructor(name : string, desc : string, type : CommandType_t ) {
        this.command.name = name;
        this.command.description = desc;
        this.command.type = type;
    }

    public setDefaultMemberPermission(defaultMemberPermission : string) : void {
        this.command.default_member_permissions = defaultMemberPermission;
    }

    public setOptions (options : option_t[]) : void {
        this.command.options = options;
    }

   public toJSON() : RESTPostAPIApplicationCommandsJSONBody
   {
       return {
           name : this.command.name,
           description : this.command.description,
           options : this.command.options,
           default_member_permissions : this.command.default_member_permissions,
           type : MyCommandToApplicationCommand_t(this.command.type)
       }
   }

}