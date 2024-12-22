import { msToTime, parseTime, setScore } from "../../../util";
import * as Minecraft from "@minecraft/server";
import settings from "../../../data/settings";
import config from "../../../data/config";
import data from "../../../data/data";
let lastNotify = 0;
const world = Minecraft.world;
export function banPlayer(player, reason, time, by) {
    // this removes old ban stuff
    player.getTags().forEach(t => {
        if (t.includes("reason:") || t.includes("by:") || t.includes("time:")) player.removeTag(t);
    });

    // Add ban tags
    player.addTag(`by:${by}`);
    const banLength2 = parseTime("7d");
    // @ts-ignore
    player.addTag(`time:${Date.now() + banLength2}`);
    player.addTag("isBanned");
    
    player.addTag(`reason:${reason}`);
    setScore(player, "kickvl", 0);

    if (settings.general.theme === "1") {
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r A player has been banned from your game for using an §6unfair advantage! (7-Day)"}]}`);
    } else {
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c "}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c||===========================================||"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§u§l Isolate Anticheat"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§u Player Banned:§t §n${player.name}"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§u Reason: ${reason} - By: ${by} - Time: {${time}}"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c||===========================================||"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c "}]}`);
    }

    // Add player to ban list
    addBanList(player, reason, by);

    player.runCommandAsync("function tools/resetwarns");
}

export function addBanList(player, reason, by) {
    const banList = JSON.parse(world.getDynamicProperty("banList"));
    banList[player.name] = [player.nameTag, `Anticheat: ${check}/${checkType}`, "Isolate"];
    banList[player.name] = [player.nameTag, reason, by];
    world.setDynamicProperty("banList", JSON.stringify(banList));
}
/**
 * @name banMessage
 * @param {Minecraft.Player} player - The player object
 * @example banMessage(player);
 * @remarks Bans the player from the game.
 */

export function banMessage(player) {
    // validate that required params are defined
    if (typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);

    // @ts-expect-error
    if (config.flagWhitelist.includes(player.name) && player.hasTag("op")) return;

    // @ts-expect-error
    if (data.unbanQueue.includes(player.name.toLowerCase().split(" ")[0])) {
        player.removeTag("isBanned");

        player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has been found in the unban queue and has been unbanned."}]}`);

        player.getTags().forEach(t => {
            if (t.includes("reason:") || t.includes("by:") || t.includes("time:")) player.removeTag(t);
        });

        // remove the player from the unban queue
        for (let i = -1; i < data.unbanQueue.length; i++) {
            if (data.unbanQueue[i] !== player.name.toLowerCase().split(" ")[0]) continue;

            data.unbanQueue.splice(i, 1);
            break;
        }
        // Remove the player for the ban list
        for (let i = -1; i < data.banList.length; i++) {
            // @ts-ignore
            if (data.banList[i].ign !== player.name) continue;
            data.banList.splice(i, 1);
            break;
        }
        return;
    }

    let reason;
    let by;
    let time;

    player.getTags().forEach(t => {
        if (t.includes("by:")) by = t.slice(3);
        else if (t.includes("reason:")) reason = t.slice(7);
        else if (t.includes("time:")) time = t.slice(5);
    });


    if (time) {
        if (time < Date.now()) {
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name}'s ban has expired and has now been unbanned."}]}`);

            // ban expired, woo
            player.removeTag("isBanned");
            player.getTags().forEach(t => {
                if (t.includes("reason:") || t.includes("by:") || t.includes("time:")) player.removeTag(t);
            });
            return;
        }

        time = msToTime(Number(time));
        time = `${time.w} weeks, ${time.d} days, ${time.h} hours, ${time.m} minutes, ${time.s} seconds`;
    }
    if(Date.now() - lastNotify > 5000) {
        player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} was kicked for being banned. Ban Reason: ${reason || "You are banned!"}."}]}`);
        lastNotify = Date.now();
    }
    try {
        player.runCommandAsync(`kick "${player.name}" §r\n§l§cYOU ARE BANNED!\n§mBanned By:§r ${by || "N/A"}\n§bReason:§r ${reason || "N/A"}\n§aBan Length:§r ${time || "Permanant"}`);
    } catch (error) {
        player.triggerEvent("scythe:kick");
    }
}
