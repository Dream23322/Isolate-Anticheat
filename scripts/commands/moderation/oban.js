import * as Minecraft from "@minecraft/server";
import { parseTime } from "../../util.js";
import { playerTellraw } from "../../utils/gameUtil.js";

const world = Minecraft.world;

/**
 * @name ban
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function oban(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide who to ban.");

    const time = args[1] ? parseTime(args[1]) : undefined;

    //if(!time) args.splice(1, 1);

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
    // try to find the player requested
    const member = args[0]
    // make sure they dont ban themselves
    if(member === player.nameTag) return player.sendMessage("§r§j[§uIsolate§j]§r You cannot ban yourself.");


    // Add the player to the ban list
    const banList = JSON.parse(world.getDynamicProperty("offlineList"));
    banList[member] = [member, reason, player.nameTag, Date.now(), time || "Permanent"];
    world.setDynamicProperty("offlineList", JSON.stringify(banList));

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has banned ${member} for ${reason} (OFFLINE BAN)"}]}`);
}
