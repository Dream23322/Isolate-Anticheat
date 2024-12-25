import * as Minecraft from "@minecraft/server";
import { getScore } from "../../util";

const world = Minecraft.world;

/**
 * @name stats
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function stats(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    
    if(!args.length) return player.runCommandAsync("function tools/stats");
    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }
    
    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");


    // Get platform type
    // This is possible since the 1.21.4X update which again gives the scripting api access to players device information.
    let platform_type = "Failed-Get";
    try {
        platform_type = member.clientSystemInfo.platformType;
    } catch(e) {
        console.warn("[Isolate] >> Failed to get platform type: " + e);
    }
    let input_type = "Failed-Get";
    try {
        input_type = member.inputInfo.lastInputModeUsed;
    } catch(e) {
        console.warn("[Isolate] >> Failed to get input type: " + e);
    }
    // Get the players gamemode
    const gamemode = member.hasTag("gmc") ? "Creative" :
                     member.hasTag("gms") ? "Survival" :
                     member.hasTag("gma") ? "Adventure" : "Spectator";

    // Get the players coords
    const coords = member.location;

    // Isolate Info
    const isIcy = member.hasTag("freeze");
    const isVanished = member.hasTag("vanish");
    const kicks = getScore(member, "kickvl", 0);
    const flying = member.hasTag("flying");

    const misc_checks = ["spammer", "namespoof", "autotool", "exploit", "crasher", "badpackets","timer"];

    const combat_checks = ["reach", "aim", "autoclicker", "killaura", "hitbox"];

    const movement_checks = ["noslow", "sprint", "speed", "fly", "motion", "strafe", "prediction"];

    const world_checks = ["nuker", "scaffold", "tower"];

    let misc_VL = 0;
    let combat_VL = 0;
    let movement_VL = 0;
    let world_VL = 0;

    for(const check of misc_checks) {
        misc_VL += getScore(member, `${check}vl`, 0);
    }

    for(const check of combat_checks) {
        combat_VL += getScore(member, `${check}vl`, 0);
    }

    for(const check of movement_checks) {
        movement_VL += getScore(member, `${check}vl`, 0);
    }

    for(const check of world_checks) {
        world_VL += getScore(member, `${check}vl`, 0);
    }

    // Make a nice little layout for it all

    const text = `
§r§j[§uIsolate§j]§r
Stats for: ${member.name}

Device: ${platform_type}
Input: ${input_type}
Gamemode: ${gamemode}
Coords: ${coords.x.toFixed(2)}, ${coords.y.toFixed(2)}, ${coords.z.toFixed(2)}

Isolate Stats

Frozen: ${isIcy}
Vanished: ${isVanished}
Kicks: ${kicks}
LastMove: ${player.ticksSinceLastMove}  
Flying: ${flying}

Misc Check flags: ${misc_VL}
Combat Check flags: ${combat_VL}
Movement Check flags: ${movement_VL}
World Check flags: ${world_VL}

Combined Flags: ${misc_VL + combat_VL + movement_VL + world_VL}`;


    player.sendMessage(text);
}   

