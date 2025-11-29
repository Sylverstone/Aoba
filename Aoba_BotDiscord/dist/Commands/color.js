import { SlashCommandStringOption, AttachmentBuilder } from "discord.js";
import { CommandType_t } from "../Loaders/LoadCommands.js";
import { createCanvas } from "@napi-rs/canvas";
import CopiableText from "../Utils/TexteCopiable.js";
const Commande = {
    name: "color",
    description: "Permet d'afficher une couleur en mettant son code hexadécimal.",
    howToUse: `Entrez la commande \`/color {code_hex}\` où {code_hex} est le code hexadecimal de la couleur.\nSi le code n'est pas valide, la couleur noir sera affiché.`,
    admin: false,
    typeCommand: CommandType_t.CHAT_INPUT,
    run: async function (bot, interaction) {
        await interaction.deferReply();
        const hex = interaction.options.getString("couleur", true);
        const canvas = createCanvas(50, 50);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'COLOR.png' });
        return interaction.editReply({ content: `${CopiableText(hex)}`, files: [attachment] });
    },
    optionString: [
        new SlashCommandStringOption()
            .setName("couleur")
            .setDescription("le code couleur en hex")
            .setRequired(true)
    ]
};
export default Commande;
