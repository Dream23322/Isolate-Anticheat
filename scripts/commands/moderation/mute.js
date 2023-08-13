import * as Minecraft from "@minecraft/server";
import { banAnimation  } from "../../util";
const world = Minecraft.world;

/**
 * @name mute
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function mute(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide who to mute.");

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");

    // make sure they dont mute themselves
    if(member.id === player.id) return player.sendMessage("§r§j[§uIsolate§j]§r You cannot mute yourself.");

    member.addTag("isMuted");
    member.sendMessage(`§r§j[§uIsolate§j]§r You have been muted. Reason: ${reason}`);

    // remove chat ability
    member.runCommandAsync("ability @s mute true");

    banAnimation(player, "type2");
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has muted ${member.nameTag} for ${reason}"}]}`);
}
