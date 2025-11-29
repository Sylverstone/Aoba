import { MessageFlags, TextChannel, ChannelType, ChannelSelectMenuBuilder, ActionRowBuilder, ComponentType, ThreadAutoArchiveDuration } from "discord.js";
import { CommandType_t } from "../Loaders/LoadCommands.js";
import { CollectorEndReason } from "../types/types.js";
import ModelParams from "../Models/ModelParams.js";
const Commande = {
    name: "setup_redirect",
    description: "Commande à utiliser directement sur un message. Elle vous permet de dire au bot de logs les réactions envoyé sur ce message.",
    howToUse: "Cliquez sur un message, rendez-vous dans l'onglet application et selectionnez la commande \`/setup_redirect\`.",
    admin: true,
    typeCommand: CommandType_t.MESSAGE_COMMAND,
    run: async function (bot, interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        const targetMessage = interaction.targetMessage;
        if (await ModelParams.doMessageAlreadyHaveRedirection(targetMessage.id)) {
            return interaction.editReply({ content: `**Je logs déjà les réactions de ce message dans un salon...**` });
        }
        const channel = targetMessage.channel;
        if (!(channel instanceof TextChannel))
            return;
        const th = await channel.threads.create({
            name: `Config - ${interaction.user.displayName}`,
            reason: "Configuration de la commande setup_redirect",
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneHour
        });
        await th.members.add(interaction.user.id);
        await interaction.editReply({ content: `Venez dans le thread *(<#${th.id}>)* pour continuer la configuration ! :)` });
        const validChannelForRedirect = new ChannelSelectMenuBuilder()
            .setChannelTypes(ChannelType.GuildText)
            .setCustomId("v")
            .setPlaceholder("Dans quel salon je dois envoyer les logs ?")
            .setMaxValues(1)
            .setMinValues(1);
        const ar = new ActionRowBuilder()
            .addComponents(validChannelForRedirect);
        const QuestionMessage = await th.send({ components: [ar] });
        const co = th.createMessageComponentCollector({
            time: 2 * 1000 * 60,
            componentType: ComponentType.ChannelSelect
        });
        co.on("collect", async (channelSelectInteraction) => {
            const GuildChannel = await channelSelectInteraction.guild?.channels.fetch(channelSelectInteraction.values[0]);
            if (!GuildChannel) {
                await channelSelectInteraction.reply({
                    content: "Je ne trouve pas ce channel sur le serveur"
                });
                return;
            }
            //channel trouvé
            const params = {
                redirectSalonId: GuildChannel.id,
                messageId: interaction.targetMessage.id,
                guildId: interaction.guildId ?? "",
                channelId: interaction.channelId
            };
            await bot.collections.params?.insertOne(params);
            co.stop("success");
        });
        co.on("end", async (c, reason) => {
            //timestamps en second pour discord
            const ts = Date.now() / 1000;
            const lastInteraction = c.last();
            const timeBeforeDelete = 30; //s
            switch (reason) {
                case CollectorEndReason.LIMIT:
                    await QuestionMessage.edit({ content: `Vous n'avez pas répondu à temps, le thread sera supprimer <t:${Math.round(ts + timeBeforeDelete)}:R>` });
                    break;
                case CollectorEndReason.TIME:
                    await QuestionMessage.edit({ content: `Vous n'avez pas répondu à temps, le thread sera supprimer <t:${Math.round(ts + timeBeforeDelete)}:R>` });
                    break;
                case "success":
                    if (!lastInteraction)
                        await QuestionMessage.edit({ content: `La configuration à réussi !, le thread sera supprimer <t:${Math.round(ts + timeBeforeDelete)}:R>` });
                    else
                        await lastInteraction.reply({ content: `La configuration à réussi !, le thread sera supprimer <t:${Math.round(ts + timeBeforeDelete)}:R>` });
                    break;
            }
            setTimeout(async () => {
                try {
                    await th.delete();
                }
                catch (err) {
                    console.error(err);
                }
            }, timeBeforeDelete * 1000);
        });
    },
};
export default Commande;
