import fs from "fs";
import path from "path";
import __dirname from "../dirname.js";
import {pathToFileURL} from "url";
import {isScript_t} from "../class/CBot.js";
import {script_t} from "../config/types.js";
import {Worker} from "node:worker_threads";
import {Collection} from "discord.js";

//Test d'utilisation de worker pour les thread, pas très concluant, et inutile dans ce cas
// function chunkify<T>(array : T[], nThread : number)
// {
//     let chunks = [];
//     for(let i = nThread; i > 0; i--)
//         chunks.push(array.splice(0,Math.ceil(array.length / i)));
//
//     return chunks;
// }
//
// function run(commandes : string[], nThread: number, )
// {
//     const chunks = chunkify(commandes, nThread);
//     console.log("chuncks : ",chunks);
//     let ScripList : script_t[] = [];
//     let fini = false;
//
//     chunks.forEach((commandes,i) =>{
//
//         if(commandes.length == 0)
//             return;
//
//         console.log("Create worker");
//         const worker = new Worker("./worker.js");
//
//         worker.postMessage(commandes);
//         worker.on("message", (scripts : script_t[]) => {
//             console.log("message h");
//             ScripList.concat(scripts);
//             if(i == chunks.length - 1)
//                 fini = true;
//         })
//     })
//
//     while(!fini){
//         continue;
//     }
//
//     return ScripList;
// }

export default async function getAllCommands()
{

    const Commandes = fs.readdirSync(path.join(__dirname,"Commands")).map(p => {
        return path.join(__dirname,"Commands", p);
    })

    let ScriptList : Collection<string, script_t> = new Collection();//run(Commandes,8);

    for(const commande of Commandes)
    {
        const Commande= (await import(pathToFileURL(commande).href)).default;
        if(!isScript_t(Commande))
            continue;
        ScriptList.set(Commande.name, Commande);
    }

    return ScriptList;
}