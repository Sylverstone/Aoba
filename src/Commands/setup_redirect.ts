import {
    MessageContextMenuCommandInteraction,
    MessageFlags,
    TextChannel,
    ChannelType, Snowflake
} from "discord.js";
import {script_t} from "../config/types.js";
import {CommandType_t} from "../Loaders/LoadCommands.js";
import {CBot} from "../class/CBot.js";
import Params from "../DBModels/params.js";
import {CollectorEndReason} from "../types/types.js";
import ModelParams from "../Models/ModelParams.js";


type CommandData = {
    name : string,
    description : string,
    admin : boolean,
    type : CommandType_t
}

const Commande : script_t =
    {
        name : "setup_redirect",
        description : "hello",
        admin : false,

        typeCommand : CommandType_t.MESSAGE_COMMAND,

        run : async function(bot : CBot, interaction : MessageContextMenuCommandInteraction){

            await interaction.deferReply({ flags : [MessageFlags.Ephemeral]});

            const targetMessage = interaction.targetMessage;

            if(await ModelParams.doMessageAlreadyHaveRedirection(targetMessage.id))
            {
                return interaction.editReply({ content : `**Je logs déjà les réactions de ce message dans un salon...**`});
            }

            const channel = targetMessage.channel;
            if(!(channel instanceof  TextChannel))
                return;

            const th = await channel.threads.create({
                name : `Config - ${interaction.user.displayName}`,
                reason : "Configuration de la commande setup_redirect",
                type : ChannelType.PrivateThread
            })

            await th.members.add(interaction.user.id);

            await interaction.editReply({ content : `Venez dans le thread (<#${th.id}>) pour continuer la configuration ! :))`});

            const QuestionMessage = await th.send({ content : `J'envoie un message où quand quelqu'un réagit ?`});

            const co = th.createMessageCollector({
                time : 2 * 1000 * 60
            })

            co.on("collect", async (message) => {
                console.log(message.content);
                if(message.content.length < 2)
                    return;
                const contentParsed : Snowflake = message.content.slice(2, message.content.length - 1);
                try
                {
                    const GuildChannel = await message.guild?.channels.fetch(contentParsed);

                    if(!GuildChannel){
                        await message.reply({
                            content : "Je ne trouve pas ce channel sur le serveur"
                        })
                        return;
                    }

                    //channel trouvé
                    const params : Params = {
                        redirectSalonId : GuildChannel.id,
                        messageId : interaction.targetMessage.id,
                        guildId : interaction.guildId ?? "",
                        channelId : interaction.channelId
                    }

                    await bot.collections.params?.insertOne(params);

                    co.stop("success");
                }
                catch (err)
                {
                    await message.reply({
                        content : "Je ne trouve pas ce channel sur le serveur"
                    })

                    return;
                }

            })

            co.on("end", async(c,reason) => {
                //timestamps en second pour discord
                const ts = Date.now() / 1000;
                switch (reason) {
                    case CollectorEndReason.LIMIT:
                        QuestionMessage.edit({ content : `Vous n'avez pas répondu à temps, le thread sera supprimer <t:${Math.round(ts + (2 * 60))}:R>`});
                        break;

                    case CollectorEndReason.TIME:
                        QuestionMessage.edit({ content : `Vous n'avez pas répondu à temps, le thread sera supprimer <t:${Math.round(ts + (2 * 60))}:R>`});
                        break;

                    case "success":
                        QuestionMessage.edit({ content : `La configuration à réussi !, le thread sera supprimer <t:${Math.round(ts + (2 * 60))}:R>`});
                        break;
                }

                setTimeout(async() => {
                    await th.delete();
                }, 2 * 1000 * 60);

            })
        },
    }

export default Commande;