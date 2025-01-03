import * as Minecraft from "@minecraft/server";
import { setScore } from "../../util";
const world = Minecraft.world;

/**
 * @name resetwarns
 * @param {Message} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function resetwarns(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    
    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide who's warns to reset.");

    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }
    
    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");

    if(member.id === player.id) return player.sendMessage("§r§j[§uIsolate§j]§r You cannot reset your own warns.");

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has reset ${member.nameTag}'s warns."}]}`);

    //member.runCommandAsync("function tools/resetwarns");

    const check_names = [
        "spammer", "namespoof", "autotool", "exploit", "crasher", "badpackets", "timer",
        "reach", "aim", "autoclicker", "killaura", "hitbox",
        "noslow", "invalidsprint", "speed", "fly", "motion",
        "nuker", "scaffold", "tower", "kick"
    ];

    for(const name of check_names) {
        setScore(member, `${name}vl`, 0);
    }
}
