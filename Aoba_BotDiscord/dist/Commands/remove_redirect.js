import { MessageFlags } from "discord.js";
import { CommandType_t } from "../Loaders/LoadCommands.js";
import ModelParams from "../Models/ModelParams.js";
const Commande = {
    name: "remove_redirect",
    description: "Commande à utiliser directement sur un message. Elle vous permet de dire au bot d'arrêter de le suivre.",
    howToUse: "Cliquez sur un message, rendez-vous dans l'onglet application et selectionnez la commande \`/remove_redirect\`.\nCe message ne sera plus suivie par le bot.",
    admin: true,
    typeCommand: CommandType_t.MESSAGE_COMMAND,
    run: async function (bot, interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        const messageId = interaction.targetId;
        switch (await ModelParams.deleteMessageFollow(messageId)) {
            case true:
                return interaction.editReply({ content: "Le bot ne suivra plus ce message." });
            case false:
                return interaction.editReply({ content: "Je ne suis pas ce message.." });
            case null:
                return interaction.editReply({ content: "Une erreur à eu lieu !" });
        }
    },
};
export default Commande;
