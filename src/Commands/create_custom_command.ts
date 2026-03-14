import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBooleanOption,
    SlashCommandStringOption
} from "discord.js";
import {script_t} from "../config/types.js";
import {CommandType_t} from "../Loaders/LoadCommands.js";
import {CBot} from "../class/CBot.js";
import GuildCustomCommandHandler from "../class/GuildCustomCommandHandler.js";

const Commande : script_t =
    {
        name : "create_custom_command",
        description : "Permets de créer une commande personnalisée qui retournera une valeur définie",
        howToUse : ` `,
        admin : false,

        typeCommand : CommandType_t.CHAT_INPUT,

        run : async function(bot : CBot, interaction : ChatInputCommandInteraction){

            await interaction.deferReply({ flags : [MessageFlags.Ephemeral]})
            const commandName = interaction.options.getString("command-name",true);
            const commandValue = interaction.options.getString("command-value",true)
            const commandDesc = interaction.options.getString("command-description",true);
            const commandEphemere = interaction.options.getBoolean("command-ephemere",true);

            const guildName = interaction.guild?.name;
            const guildId = interaction.guild?.id;

            if(!guildName || !guildId)
                return;

            // const model = new ModelCustomCommand();
            // //const db = client.db("ParamsDB");
            // await model.connect();
            //
            // const newCollectionName = Utils.GenerateCollectionName(guildId,guildName);
            //
            // await model.setCollection(newCollectionName.toLowerCase());
            // //await db.createCollection(newCollectionName);
            //
            // await model.InsertCustomCommand({
            //     name : commandName,
            //     description : commandDesc,
            //     value : commandValue,
            //     message_ephemere : commandEphemere
            // });
            //
            // await addCommand(bot,guildId,commandName,commandDesc);
            // await model.close();
            // const newFilePath = path.join(__dirname,"..","data",Utils.GenerateCollectionName(guildId,guildName) + ".json");
            //
            // if(fs.existsSync(newFilePath))
            // {
            //     const content = fs.readFileSync(newFilePath).toString();
            //
            //     const JSONData = content.length > 0 ? JSON.parse(content) : {};
            //
            //     JSONData.commands.push({
            //         "name" : commandName,
            //         "value" : commandValue,
            //         "description" : commandDesc,
            //         "message_ephemere" : commandEphemere,
            //     })
            //
            //     fs.writeFileSync(newFilePath, JSON.stringify(JSONData, null, 4));
            //
            // }
            // else
            // {
            //     const data = {
            //         "commands" : [
            //             {
            //                 "name" : commandName,
            //                 "value" : commandValue,
            //                 "description" : commandDesc,
            //                 "message_ephemere" : commandEphemere,
            //             }
            //         ]
            //     };
            //
            //     if(!fs.existsSync(path.join(__dirname,"Data")))
            //         await fsp.mkdir(path.join(__dirname,"..","data"));
            //
            //     await fsp.writeFile(newFilePath, JSON.stringify(data, null, 2), "utf-8");
            // }
            //
            // await loadCommandsOnServer(bot,guildId);
            const guildCustomCommandHandler = await GuildCustomCommandHandler.GetGuildCustomCommandHandler(guildId,bot);

            if(!guildCustomCommandHandler)
            {
                return interaction.editReply({
                    content : "Une erreur à eu lieu",
                });
            }

            switch (await guildCustomCommandHandler.AddCustomCommand({
                name : commandName,
                description : commandDesc,
                message_ephemere : commandEphemere,
                value : commandValue
            })){

                case true:
                    return interaction.editReply({
                        content : `La commande /${commandName} à été ajouté au bot !\nElle retournera -> ${commandValue}`
                    });

                case false:
                    return interaction.editReply({
                        content : `La commande \`${commandName}\` existe déjà !`
                    });

                case null:
                    await guildCustomCommandHandler.RemoveLastCommand();
                    return interaction.editReply({
                        content : "Une erreur à eu lieu"
                    })
            }
        },

        optionString : [
            new SlashCommandStringOption()
                .setName("command-name")
                .setDescription("le nouveau nom de la commande")
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(32),
            new SlashCommandStringOption()
                .setName("command-value")
                .setDescription("Ce que retourne la commande")
                .setRequired(true)
                .setMaxLength(2000),
            new SlashCommandStringOption()
                .setName("command-description")
                .setDescription("La description de la commande, max 100 characters")
                .setRequired(true)
                .setMaxLength(100),
        ],

        optionBoolean : [
            new SlashCommandBooleanOption()
                .setName("command-ephemere")
                .setDescription("Si oui, alors la réponse à la commande ne sera vu que pas l'utilisateur")
                .setRequired(true)
        ]
    }

export default Commande;