import * as Minecraft from "@minecraft/server";
import { parseTime } from "../../util.js";
import { banAnimation } from "../../util.js";

const world = Minecraft.world;

/**
 * @name testban
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function testban(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide who to ban.");

    const time = args[1] ? parseTime(args[1]) : undefined;

    if(!time) args.splice(1, 1);

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");
    banAnimation(member, "type1");
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has banned ${member.nameTag} for ${reason}"}]}`);
}
