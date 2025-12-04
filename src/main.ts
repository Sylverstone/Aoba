import { ActivityType, Events } from "discord.js";
import {CBot}  from "./class/CBot.js";
import "dotenv/config";
import { loadCommandsOnAllServers } from "./Loaders/LoadCommands.js";
import loadEvenements from "./Loaders/LoadEvents.js";


let bot = new CBot();

bot.login(process.env.TOKEN).then(async () => {

    bot.once(Events.ClientReady, async () => {
        console.log("Connected");


        await loadCommandsOnAllServers(bot);
        await loadEvenements(bot);

        bot.setupActivity();

        bot.user?.setStatus("dnd");
    })

});

// const connection = GetConnection();
//
// connection.then(conn => {
//     if(!conn) return;
//
//     let bot = new CBot(conn);
//     bot.once(Events.ClientReady, async() =>
//     {
//
//         await bot.initVar();
//         await bot.intervals();
//
//         await bot.user?.setUsername("Mr Cash");
//
//         bot.user?.setActivity({
//             type : ActivityType.Custom,
//             name : "Fais sa comptabilité"
//         })
//
//
//         await loadUserCommandsOnAllServers(bot);
//         await loadEvenements(bot);
//
//     })
//
//     bot.login(bot.getToken());
// })
