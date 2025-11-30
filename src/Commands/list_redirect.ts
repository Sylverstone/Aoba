import {
    MessageContextMenuCommandInteraction,
    MessageFlags,
    TextChannel,
    ChannelType, Snowflake, ChannelSelectMenuBuilder, ActionRowBuilder, ChannelSelectMenuComponent,
    ComponentType,
    ThreadAutoArchiveDuration, SlashCommandStringOption, ChatInputCommandInteraction, AttachmentBuilder, Attachment,
    APIAttachment,
    AttachmentFlags, StringSelectMenuBuilder
} from "discord.js";
import {script_t} from "../config/types.js";
import {CommandType_t} from "../Loaders/LoadCommands.js";
import {CBot} from "../class/CBot.js";
import Params, {ParamsQuery_t} from "../DBModels/params.js";
import {CollectorEndReason, isListParams_t} from "../types/types.js";
import ModelParams from "../Models/ModelParams.js";



const Commande : script_t =
    {
        name : "list_redirect",
        description : `Permet de voir l'ensemble des messages suivies par le bot. Vous pourrez les supprimer également.`,
        howToUse : `Entrez simplement \`/list_redirect\`, ensuite vous pourrez choisir dans un menu déroulant le message que vous ne voulez plus que le bot suive.`,
        admin : true,

        typeCommand : CommandType_t.CHAT_INPUT,

        run : async function(bot : CBot, interaction : ChatInputCommandInteraction){

            await interaction.deferReply({ flags : [MessageFlags.Ephemeral]});

            const Query : ParamsQuery_t = { guildId : interaction.guildId ?? "" };
            const params = await bot.collections.params?.find(Query).toArray();
            if(!isListParams_t(params))
                return;

            const messageContents = await Promise.all(params.map( async(o : Params) => {
                const channel = await interaction.guild?.channels.fetch(o.channelId);
                if(!channel)
                    return "";

                await channel.fetch()
                if(!(channel instanceof  TextChannel))
                    return "";

                const message = await channel.messages.fetch(o.messageId);

                return message.content;
            }));

            if(messageContents.length <= 0)
            {
                await interaction.editReply({ content : "***Je ne suis aucun message actuellement !***"});
                return;
            }

            const texte = `**Je suis actuellement ces messages :**\n\n${messageContents.map((ctn,i) => `**${i} :**\n${ctn}\n[*Cliquez ici pour revenir au message*](https://discord.com/channels/${params[i].guildId}/${params[i].channelId}/${params[i].messageId})`).join("\n")}\n\nSi vous ne voulez plus que je suive l'un de ces messages, choisissez son index dans le menu déroulant.\nSinon ne faites rien et <t:${Math.round((Date.now() / 1000) + (2 * 60))}:R> les choix ne seront plus dispo`;

            const options = params.map((o : Params, i) => {
                console.log(o);
                return {
                    value : o.messageId,
                    label : `${i} - ${messageContents[i].slice(0, 20)}${messageContents[i].length > 20 ? '...' : ''}`
                }
            });

            const stringSelect = new StringSelectMenuBuilder()
                .setCustomId("id")
                .setPlaceholder("Choisissez les messages que je ne dois plus suivre")
                .addOptions(options)
                .setMinValues(1)
                .setMaxValues(options.length);

            const ar = new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(stringSelect);

            const message = await interaction.editReply({ content : texte, components : [ar]});

            const co = message.createMessageComponentCollector({
                time : 2 * 1000 * 60,
                componentType : ComponentType.StringSelect,
            })

            co.on("collect", async(interaction) => {
                const MessageIDSToUnfollow = interaction.values;

                for(const ID of MessageIDSToUnfollow)
                {
                    await ModelParams.deleteMessageFollow(ID);
                }

                await interaction.reply({
                    flags : [MessageFlags.Ephemeral],
                    content : `Je ne suivrais plus ces messages..`
                })

                co.stop("success");
            })

            co.on("end", async(c,reason) => {
                stringSelect.setDisabled(true);
                switch (reason){
                    case CollectorEndReason.LIMIT:
                    case CollectorEndReason.TIME:
                        await interaction.editReply({ components : [ar]});
                        break;
                }
            })
        },

    }

export default Commande;