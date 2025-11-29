import {pathToFileURL} from "url";
import {isScript_t} from "../class/CBot";

import { parentPort } from "node:worker_threads";
import {script_t} from "../config/types.js";

//test d'utilisation de worker pour le multithread, pas concluant pour l'instant
parentPort?.on("message", (Commandes : string[]) => {
    let ScriptList: script_t[] = [];
    console.log("here");

    Commandes.forEach(async(commande : string) => {
        const Commande = (await import(pathToFileURL(commande).href)).default;
        if(!isScript_t(Commande)) {
            return;
        }
        ScriptList.push(Commande);
    });

    parentPort?.postMessage(ScriptList);
})

