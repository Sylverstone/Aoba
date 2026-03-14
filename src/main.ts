import { ActivityType, Events } from "discord.js";
import {CBot}  from "./class/CBot.js";
import "dotenv/config";
import { loadCommandsOnAllServers } from "./Loaders/LoadCommands.js";
import loadEvenements from "./Loaders/LoadEvents.js";
import {MongoClient} from "mongodb";





let bot = new CBot();

bot.login(process.env.TOKEN).then(async () => {

    // const client = new MongoClient(process.env.DB_URL ?? "");
    // const db = client.db("ParamsDB");
    // await db.dropCollection("Testeur-1324747504280928257");
    //console.log((await db.listCollections().toArray()).filter(e => e.name == ""));
    // return;
    bot.once(Events.ClientReady, async () => {
        console.log("Connected");

        console.log("start loading");
        await loadCommandsOnAllServers(bot);
        await loadEvenements(bot);
        console.log("endLoading");

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
