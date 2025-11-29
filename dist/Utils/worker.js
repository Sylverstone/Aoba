import { pathToFileURL } from "url";
import { isScript_t } from "../class/CBot";
import { parentPort } from "node:worker_threads";
//test d'utilisation de worker pour le multithread, pas concluant pour l'instant
parentPort?.on("message", (Commandes) => {
    let ScriptList = [];
    console.log("here");
    Commandes.forEach(async (commande) => {
        const Commande = (await import(pathToFileURL(commande).href)).default;
        if (!isScript_t(Commande)) {
            return;
        }
        ScriptList.push(Commande);
    });
    parentPort?.postMessage(ScriptList);
});
