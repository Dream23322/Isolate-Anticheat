import * as Minecraft from "@minecraft/server";
import config from "../../data/config";
import { getScore, parseTime, setScore } from "../../util";
import settings from "../../data/settings";
const world = Minecraft.world;

/**
 * @name report
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function report(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    const reason = args.slice(1).join(" ") || "No reason specified";

    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide who to report.");
    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");

    // make sure they dont report themselves
    if(member.nameTag === player.nameTag && !settings.general.testingmode) return player.sendMessage("§r§j[§uIsolate§j]§r You cannot report yourself.");

    // prevent report spam
    if(player.reports.includes(member.nameTag)) return player.sendMessage("§r§j[§uIsolate§j]§r You have already reported this player.");
    player.reports.push(member.nameTag);

    player.sendMessage(`§r§j[§uIsolate§j]§r You have reported ${member.nameTag} for: ${reason}.`);
    
    member.addTag("strict");
    member.addTag("reported");
    if(settings.report.enabled && settings.report.enabled) {
        if(getScore(player, "kickvl", 0) > settings.report.minKicks) {
            // Ban lel
            if(settings.general.theme === "1") {
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r A player has been banned from your game for using an §6unfair advantage! (7-Day)"}]}`);
            } else if(settings.general.theme === "2") {
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c "}]}`); 
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c||===========================================||"}]}`);
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§u§l Isolate Anticheat"}]}`);
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§u Player Banned:§t §n${member.name}"}]}`);
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§u Reason: §dUnfair Advantage§t - 7 days"}]}`);
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c||===========================================||"}]}`);
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c "}]}`); 
            }
            let banLength2;
            player.addTag("by:§d Isolate Anticheat");
            player.addTag(`reason:§c Isolate Anticheat caught you cheating!`);
            banLength2 = parseTime("7d");
            player.addTag(`time:${Date.now() + banLength2}`);
            player.addTag("isBanned");
            setScore(player, "kickvl", 0);
            console.warn(`${new Date().toISOString()} |${player.name} was banned by Isolate Anticheat for bad data when reported`);
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has been §cpunished§r (§cBan§r) for cheating (REPORTED)"}]}`);
        }
    }
    // white people 
    player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has reported ${member.nameTag} for ${reason}"}]}`);
}
