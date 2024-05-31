import data from "../../data/data";
import { playerTellraw } from "../../utils/gameUtil";
import { world } from "@minecraft/server";
/**
 * @name banlist
 * @param {object} message - Message object
 */
export function banlist(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    let banls = JSON.parse(world.getDynamicProperty("banList"));          
    playerTellraw(player, "---------------\n§9Isolate §nBans\n§r---------------")
    let i
    for (const data in banls) {
        i++;
        playerTellraw(player, "§n" + banls[data][0] + " §r| §uReason: §d" + banls[data][1] + " §r| §uBy:§d " + banls[data][2] + "§r");
    }
    playerTellraw(player, "---------------\n");
}