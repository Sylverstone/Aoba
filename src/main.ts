import { ActivityType, Events } from "discord.js";
import {CBot}  from "./class/CBot.js";
import "dotenv/config";
import { loadUserCommandsOnAllServers } from "./Loaders/LoadCommands.js";
import loadEvenements from "./Loaders/LoadEvents.js";
import {collections, connect} from "./Connection/connection.js";
import Params from "./DBModels/params.js";

const assumeParams = (obj : unknown) : obj is Params => {
    return true;
}
connect().then(async () => {

    // const data : Params = {
    //     guildId : "didid",
    //     messageId : "iocoiuh",
    //     reaction : "react",
    //     redirectSalonId : "1234"
    // };
    //
    // await collections.params?.insertOne(data);

    // await collections.params?.deleteOne( { reaction : "react"});
    //
    // console.log("Connected to the server...");
    //
    // const Params = (await collections.params?.find({}).toArray());
    // if(!assumeParams(Params))
    //     return;
    //
    // console.log(Params);

    let bot = new CBot(collections);

    bot.once(Events.ClientReady, async () => {
        console.log("Connected");
        await loadUserCommandsOnAllServers(bot);
        await loadEvenements(bot);
    })

    bot.on(Events.MessageReactionAdd, () => {

    })

    await bot.login(process.env.TOKEN);
})

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
