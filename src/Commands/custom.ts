import {BitFieldResolvable, ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {script_t} from "../config/types.js";
import {CommandType_t} from "../Loaders/LoadCommands.js";
import {CBot} from "../class/CBot.js";
import GetGuildIDAndGuildName from "../Utils/getGuildIdAndGuildName.js";
import ModelCustomCommand from "../Models/ModelCustomCommand.js";

const Commande : script_t =
    {
        name: "custom",
        description: "yea desc",
        howToUse: `Entrez la commande \`/color {code_hex}\` où {code_hex} est le code hexadecimal de la couleur.\nSi le code n'est pas valide, la couleur noir sera affiché.`,
        admin: false,

        typeCommand: CommandType_t.CHAT_INPUT,
        customCommandHandler : true,

        run: async function (bot: CBot, interaction: ChatInputCommandInteraction) {
            const sub = interaction.options.getSubcommand();

            const {guildId, guildName} = GetGuildIDAndGuildName(interaction);

            const JsonData = ModelCustomCommand.GetGuildJsonData(guildId, guildName);

            if(!JsonData)
                return interaction.reply({ content : "Une erreur à eu lieu", flags : [MessageFlags.Ephemeral]});

            const commands = JsonData.commands;

            const SelectedCommand = commands.find(c => c.name === sub);

            if(!SelectedCommand)
                return interaction.reply({ content : "Une erreur à eu lieu", flags : [MessageFlags.Ephemeral]});

            const flags: BitFieldResolvable<"SuppressEmbeds" | "Ephemeral" | "SuppressNotifications" | "IsComponentsV2", MessageFlags.SuppressEmbeds | MessageFlags.Ephemeral | MessageFlags.SuppressNotifications | MessageFlags.IsComponentsV2> | undefined
                = SelectedCommand.message_ephemere ? [MessageFlags.Ephemeral,] : undefined;

            return interaction.reply({
                content : SelectedCommand.value,
                flags : flags
            })
        },
    }

export default Commande;