import { CommandType_t } from "../Loaders/LoadCommands.js";
const Commande = {
    name: "hello",
    description: "hello",
    admin: false,
    typeCommand: CommandType_t.CHAT_INPUT,
    run: async function (bot, interaction) {
        console.log(await bot.collections.params?.deleteMany({}));
        return interaction.reply("ok google");
    }
};
export default Commande;
