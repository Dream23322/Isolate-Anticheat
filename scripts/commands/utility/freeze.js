import * as Minecraft from "@minecraft/server";
import { banAnimation } from "../../util";
const world = Minecraft.world;

/**
 * @name freeze
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function freeze(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    
    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide which target to freeze.");
    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }
    
    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");
    banAnimation(member, "type4");
    member.runCommandAsync("function tools/freeze");
}
