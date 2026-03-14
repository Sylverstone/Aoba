import { MessageFlags } from "discord.js";
import { CommandType_t } from "../Loaders/LoadCommands.js";
import GetGuildIDAndGuildName from "../Utils/getGuildIdAndGuildName.js";
import ModelCustomCommand from "../Models/ModelCustomCommand.js";
const Commande = {
    name: "custom",
    description: "yea desc",
    howToUse: `Entrez la commande \`/color {code_hex}\` où {code_hex} est le code hexadecimal de la couleur.\nSi le code n'est pas valide, la couleur noir sera affiché.`,
    admin: false,
    typeCommand: CommandType_t.CHAT_INPUT,
    customCommandHandler: true,
    run: async function (bot, interaction) {
        const sub = interaction.options.getSubcommand();
        const { guildId, guildName } = GetGuildIDAndGuildName(interaction);
        const JsonData = ModelCustomCommand.GetGuildJsonData(guildId, guildName);
        if (!JsonData)
            return interaction.reply({ content: "Une erreur à eu lieu", flags: [MessageFlags.Ephemeral] });
        const commands = JsonData.commands;
        const SelectedCommand = commands.find(c => c.name === sub);
        if (!SelectedCommand)
            return interaction.reply({ content: "Une erreur à eu lieu", flags: [MessageFlags.Ephemeral] });
        const flags = SelectedCommand.message_ephemere ? [MessageFlags.Ephemeral,] : undefined;
        return interaction.reply({
            content: SelectedCommand.value,
            flags: flags
        });
    },
};
export default Commande;
