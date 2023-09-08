/* eslint no-redeclare: "off"*/
import * as Minecraft from "@minecraft/server";

const world = Minecraft.world;

/**
 * @name testaura
 * @param {object} message - Message object
 * @param {array} args - (Optional) Additional arguments provided.
 */

export function testaura(message, args) {
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);
    
    const player = message.sender;
    
    if(args.length === 0) return player.runCommandAsync("function tools/aura");    

    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");

    member.runCommandAsync("function tools/aura");    
    player.sendMessage("§r§j[§uIsolate§j]§r Aura bot spawned.");
}