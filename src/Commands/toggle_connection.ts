import {ActivityType, ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {script_t} from "../config/types.js";
import {CommandType_t} from "../Loaders/LoadCommands.js";
import {CBot} from "../class/CBot.js";
import * as fs from "fs";
import * as path from "path";
import __dirname from "../dirname.js";
import ModelParams from "../Models/ModelParams.js";


type CommandData = {
    name : string,
    description : string,
    admin : boolean,
    type : CommandType_t
}

export interface setting_t
{
    "allowConnection" : string
}

const Commande : script_t =
    {
        name : "toggle_connection",
        description : "hello",
        howToUse : "Si vous avez réussi à arriver jusque là, j'imagine que vous savez..",
        admin : false,
        typeCommand : CommandType_t.CHAT_INPUT,


        run : async function(bot : CBot, interaction : ChatInputCommandInteraction){

            if(interaction.user.id != process.env.IDOwner)
            {
                return interaction.reply({
                    content : "Vous ne pouvez pas effectuer cette commande !",
                    flags : [MessageFlags.Ephemeral]
                })
            }

            await interaction.deferReply({ flags : [MessageFlags.Ephemeral]});
            const pathJson = path.join(__dirname, "..","settings.json");
            const settingsJson = fs.readFileSync(pathJson).toString();
            const Json = JSON.parse(settingsJson) as setting_t;

            if(Json.allowConnection === "non")
            {
                Json.allowConnection = "oui";
            }
            else
            {
                Json.allowConnection = "non";
                await ModelParams.closeConnection();
            }

            fs.writeFileSync(pathJson, JSON.stringify(Json,null,4));

            bot.setupActivity(Json.allowConnection);

            return interaction.editReply({
                content : Json.allowConnection === "oui" ? "La connexion à la base de donnée a été autorisé" :
                    "La connexion à la base de donnée a été interdite"
            })
        }
    }

export default Commande;