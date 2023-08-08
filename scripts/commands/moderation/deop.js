import * as Minecraft from "@minecraft/server";

const world = Minecraft.world;

/**
 * @name deop
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function deop(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    
    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide who to deop.");

    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0]?.toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");

    if(!member.hasTag("op")) return player.sendMessage("§r§j[§uIsolate§j]§r This player doesnt have the op status");

    removeOp(member);

    member.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has removed ${member.name}'s isolate-op status."}]}`);
}

export function removeOp(player) {
    player.removeTag("op")

    player.sendMessage("§r§j[§uIsolate§j]§r §7You have been de-opped! If this is wrong contact your server admin.");
}

