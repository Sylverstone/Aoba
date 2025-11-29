import { MessageFlags, SlashCommandStringOption } from "discord.js";
import { CommandType_t } from "../Loaders/LoadCommands.js";
const Commande = {
    name: "man",
    description: "hello",
    howToUse: "Si vous avez réussi à arriver jusque là, j'imagine que vous savez..",
    admin: false,
    typeCommand: CommandType_t.CHAT_INPUT,
    run: async function (bot, interaction) {
        const commandName = interaction.options.getString("commande", true);
        const command = bot.commands.get(commandName);
        if (!command)
            return;
        let { howToUse } = command;
        if (!howToUse)
            howToUse = "Aucune information";
        return interaction.reply({
            embeds: [
                {
                    title: `Comment utiliser la commande ${commandName} ?`,
                    description: howToUse,
                    timestamp: new Date().toISOString(),
                    footer: {
                        icon_url: bot.user?.displayAvatarURL() ?? "",
                        text: "Au plaisir"
                    },
                    color: 0X19ff69
                }
            ],
            flags: [MessageFlags.Ephemeral]
        });
    },
    autocomplete: async function (bot, interaction) {
        const Commandes = Array.from(bot.commands.values());
        const query = interaction.options.getString("commande", true);
        return interaction.respond(Commandes.filter(commande => {
            if (query.length <= 0)
                return true;
            return commande.name.startsWith(query);
        }).map(commande => {
            return {
                value: commande.name,
                name: commande.name
            };
        }));
    },
    optionString: [
        new SlashCommandStringOption()
            .setName("commande")
            .setDescription("La commande que vous voulez apprendre à utiliser")
            .setAutocomplete(true)
            .setRequired(true)
    ]
};
export default Commande;
