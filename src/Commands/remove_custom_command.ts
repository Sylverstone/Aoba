import {ChatInputCommandInteraction, MessageFlags, SlashCommandStringOption} from "discord.js";
import {script_t} from "../config/types.js";
import {CommandType_t} from "../Loaders/LoadCommands.js";
import {CBot} from "../class/CBot.js";
import GetGuildIDAndGuildName from "../Utils/getGuildIdAndGuildName.js";
import GuildCustomCommandHandler from "../class/GuildCustomCommandHandler.js";

const Commande : script_t =
    {
        name : "remove_custom_command",
        description : "Permet de supprimer une commande personnalisé grâce à son nom.",
        howToUse : `Entrez la commande \`/color {code_hex}\` où {code_hex} est le code hexadecimal de la couleur.\nSi le code n'est pas valide, la couleur noir sera affiché.`,
        admin : false,

        typeCommand : CommandType_t.CHAT_INPUT,

        run : async function(bot : CBot, interaction : ChatInputCommandInteraction){

            await interaction.deferReply({
                flags : [MessageFlags.Ephemeral]
            });

            const commandName = interaction.options.getString("command-name", true);

            const {guildId} = GetGuildIDAndGuildName(interaction);

            const CustomCommandHandler = await GuildCustomCommandHandler.GetGuildCustomCommandHandler(guildId,bot);

            if(!CustomCommandHandler)
                return interaction.editReply({ content : "Une erreur à eu lieu"});

           switch (await CustomCommandHandler.RemoveCustomCommand(commandName))
           {
               case true:
                   return interaction.editReply({ content : `La commande \`${commandName}\` a été supprimée de vos commandes custom`});

               case false:
                   return interaction.editReply({
                       content : `La commande \`${commandName}\` n'existe pas`,
                   });

               case null:
                   return interaction.editReply({
                       content : "Une erreur à eu lieu",
                   });
           }
        },

        optionString : [
            new SlashCommandStringOption()
                .setName("command-name")
                .setDescription("le nouveau nom de la commande")
                .setRequired(true)
                .setAutocomplete(true)
                .setMinLength(1)
                .setMaxLength(32)
        ],

        autocomplete : async (bot, autocomplete) => {
            const q = autocomplete.options.getFocused();

            const {guildId} = GetGuildIDAndGuildName(autocomplete);

            const guildCustomCommandHandler = await GuildCustomCommandHandler.GetGuildCustomCommandHandler(guildId,bot);

            if(!guildCustomCommandHandler)
            {
                return autocomplete.respond([]);
            }

            const CommandsNames = guildCustomCommandHandler.GetGuildCustomCommandsName();


            return autocomplete.respond(CommandsNames.filter(name => name.startsWith(q)).map(command => ({
                    name : command,
                    value : command
                })
            ));

        }
    }

export default Commande;