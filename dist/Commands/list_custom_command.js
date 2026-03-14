import { MessageFlags } from "discord.js";
import { CommandType_t } from "../Loaders/LoadCommands.js";
import GetGuildIDAndGuildName from "../Utils/getGuildIdAndGuildName.js";
import GuildCustomCommandHandler from "../class/GuildCustomCommandHandler.js";
const Commande = {
    name: "list_custom_command",
    description: "Permet de lister toutes les commandes personnalisées de ce serveur",
    howToUse: ` `,
    admin: false,
    typeCommand: CommandType_t.CHAT_INPUT,
    run: async function (bot, interaction) {
        await interaction.deferReply({
            flags: [MessageFlags.Ephemeral]
        });
        const { guildId, guildName } = GetGuildIDAndGuildName(interaction);
        if (guildId == "")
            return interaction.editReply({
                content: "Une erreur à eu lieu",
            });
        const CustomCommandHandler = await GuildCustomCommandHandler.GetGuildCustomCommandHandler(guildId, bot);
        if (!CustomCommandHandler)
            return interaction.editReply({
                content: "Une erreur à eu lieu",
            });
        const CustomCommands = CustomCommandHandler.GetGuildCustomCommands();
        return interaction.editReply({
            embeds: [
                {
                    title: "Vos commandes custom",
                    description: CustomCommands.commands.map(command => (`# ${command.name}\n\tDescription : ${command.description}\n\tRetour : ${command.value}`)).join("\n\n"),
                    color: 0x1099A4,
                    footer: {
                        text: "Vous pouvez supprimer ou ajouter des commandes custom avec les commandes `remove_custom_command` et `create_custom_command`",
                        icon_url: bot.user?.displayAvatarURL()
                    }
                }
            ]
        });
    },
};
export default Commande;
