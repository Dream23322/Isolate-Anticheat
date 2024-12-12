import config from "../../../data/config";
import data from "../../../data/data";
import settings from "../../../data/settings";
import { world, getScore, setScore, parseTime } from "../../../util";
import { setTitle } from "../../gameUtil";
import { addLogs } from "../data/logs";
import { banPlayer } from "./ban";
import { kickPlayer } from "./kick";
import { round } from "../../maths/fastMath";
import { banAnimation  } from "../../../util";
import * as isomath from "../../../utils/maths/isomath.js";
const themeStyles = {
    "1": {
        prefix: '§r§j[§uIsolate§j]§r',
        playerName: '§r',
        failMessage: '§nhas failed §3',
        checkColour: '§u',
        separator: '§b/§h',
        holder: "",
        debugColor: '§9',
        filledColor: '§9|',
        unfilledColor: '§j|',
        currentVlFormat: '§jx§9',
    },
    "2": {
        prefix: '§r§j[§uIsolate§j]§r',
        playerName: '§r',
        failMessage: '§hhas failed §t',
        checkColour: '§u',
        separator: '§8/§i',
        holder: "",
        debugColor: '§9',
        filledColor: '§d|',
        unfilledColor: '§u|',
        currentVlFormat: '§dx§u',
    },
    "3": {
        prefix: `§r§8[§cAlice§8]§r`,
        playerName: '§7',
        failMessage: '§rhas failed §h',
        checkColour: '§c',
        separator: ' §c(',
        holder: ")",
        debugColor: '§c',
        filledColor: '§7|',
        unfilledColor: '§r|',
        currentVlFormat: '§hx§c',
    }
};

/**
 * @name flag
 * @param {object} player - The player object
 * @param {string} check - What check ran the function.
 * @param {string} checkType - What sub-check ran the function (ex. a, b ,c).
 * @param {string} hackType - What the hack is considered as (ex. movement, combat, exploit).
 * @param {string | undefined} [debugName] - Name for the debug value.
 * @param {string | number | undefined} [debug] - Debug info.
 * @param {boolean} [shouldTP] - Whether to tp the player to itself.
 * @param {object | undefined} [cancelObject] - object with property "cancel" to cancel.
 * @param {number | undefined} [slot] - Slot to clear an item out.
 * @example flag(player, "Spammer", "B", "Combat", undefined, undefined, undefined, msg, undefined);
 * @remarks Alerts staff if a player is hacking.
 */
export function flag(player, check, checkType, hackType, debugName, debug, shouldTP = false, cancelObject, slot) {
    // validate that required params are defined
    if (typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if (typeof check !== "string") throw TypeError(`Error: check is type of ${typeof check}. Expected "string"`);
    if (typeof checkType !== "string") throw TypeError(`Error: checkType is type of ${typeof checkType}. Expected "string"`);
    if (typeof hackType !== "string") throw TypeError(`Error: hackType is type of ${typeof hackType}. Expected "string"`);
    if (typeof debugName !== "string" && typeof debugName !== "undefined") throw TypeError(`Error: debugName is type of ${typeof debugName}. Expected "string" or "undefined"`);
    if (typeof debug !== "string" && typeof debug !== "number" && typeof debug !== "undefined") throw TypeError(`Error: debug is type of ${typeof debug}. Expected "string", "number" or "undefined"`);
    if (typeof shouldTP !== "boolean") throw TypeError(`Error: shouldTP is type of ${typeof shouldTP}. Expected "boolean"`);
    if (typeof cancelObject !== "object" && typeof cancelObject !== "undefined") throw TypeError(`Error: cancelObject is type of ${typeof cancelObject}. Expected "object" or "undefined`);
    if (typeof slot !== "number" && typeof slot !== "undefined") throw TypeError(`Error: slot is type of ${typeof slot}. Expected "number" or "undefined`);

    if (config.disable_flags_from_isolate_op && player.hasTag("op")) return;

    if (debug) {
        // remove characters that may break commands, and newlines
        debug = String(debug).replace(/"|\\|\n/gm, "");

        // malicious users may try make the debug field ridiculously large to lag any clients that may
        // try to view the alert (anybody with the 'notify' tag)
        if (debug.length > 256) {
            const extraLength = debug.length - 256;
            debug = debug.slice(0, -extraLength) + ` (+${extraLength} additional characters)`;
        }
    }

    const rotation = player.getRotation();

    // If debug is enabled, then we log everything we know about the player.
    if (config.debug && player.hasTag("debugFlags")) {
        const currentItem = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
        const velocity = player.getVelocity();
        const headRotation = player.getHeadLocation();

        const data = {
            timestamp: Date.now(),
            time: new Date().toISOString(),
            check: `${check}/${checkType}`,
            hackType: hackType,
            debug: `${debugName}=${debug}§r`,
            shouldTP: shouldTP,
            slot: slot,
            playerData: {
                name: player.name,
                nametag: player.nameTag,
                location: player.location,
                headLocation: headRotation,
                velocity: velocity,
                rotation: {
                    x: rotation.x,
                    y: rotation.y
                },
                tags: String(player.getTags()).replace(/[\r\n"]/gm, ""),
                currentItem: `${currentItem?.typeId ?? "minecraft:air"}`,
                selectedSlot: player.selectedSlotIndex,
                dimension: player.dimension.id,
                fallDistance: player.fallDistance,
                extra: {
                    blocksBroken: player.blocksBroken || -1,
                    entitiesHitTick: player.entitiesHit,
                    cps: player.cps || -1,
                    firstAttack: player.firstAttack || -1,
                    lastSelectedSlot: player.lastSelectedSlot || -1,
                    startBreakTime: player.startBreakTime,
                    lastThrowTime: player.lastThrow
                }
            }
        };

        console.warn(JSON.stringify(data));
    }


    // cancel the message
    if (cancelObject) cancelObject.cancel = true;



    const scoreboardObjective = check === "CommandBlockExploit" ? "cbevl" : `${check.toLowerCase()}vl`;

    if (!world.scoreboard.getObjective(scoreboardObjective)) {
        world.scoreboard.addObjective(scoreboardObjective, scoreboardObjective);
    }

    let currentVl = getScore(player, scoreboardObjective, 0);

    setScore(player, scoreboardObjective, currentVl + 1);

    console.warn("[Isolate]", player.name, check, "[", checkType, "]", hackType, "-", debugName, debug, "VL=", currentVl);

    const thememode = settings.general.theme;
    const maxVl = config.modules[check.toLowerCase() + checkType.toUpperCase()].minVlbeforePunishment;
    sendNotification(player, thememode, check, checkType, hackType, debug, debugName, currentVl, maxVl);

    const doTeleport = settings.lagbacks.silent ? false : ((currentVl / maxVl) * 100) > settings.lagbacks.percentBeforeLagback;
    if (doTeleport) player.teleport(check === "Crasher" ? { x: 30000000, y: 30000000, z: 30000000 } : player.lastGoodPosition, { dimension: player.dimension, rotation: { x: rotation.x, y: rotation.y }, keepVelocity: false });

    if (typeof slot === "number") {
        const container = player.getComponent("inventory").container;
        container.setItem(slot, undefined);
    }

    const checkData = config.modules[check.toLowerCase() + checkType.toUpperCase()];
    if (!checkData) throw Error(`No valid check data found for ${check}/${checkType}.`);
    const kickvl = getScore(player, "kickvl", 0);
    if (!checkData.enabled) throw Error(`${check}/${checkType} was flagged but the module was disabled.`);
    const message = `§u${player.name} §hwas flagged for §p${check}§r/§n${checkType}§j [§2x§n${currentVl}§j]`;

    // Check if the last message in recentLogs is the same as the new one (excluding the violation level)
    if (data.recentLogs.length > 0) {
        const lastMessage = data.recentLogs[data.recentLogs.length - 1];
        const lastMessageWithoutVl = lastMessage.substring(0, lastMessage.lastIndexOf("x") + 1);
        const newMessageWithoutVl = message.substring(0, message.lastIndexOf("x") + 1);
        if (lastMessageWithoutVl === newMessageWithoutVl) {
            // If the last message is the same as the new one, remove the last message
            data.recentLogs.pop();
        }
    }
    addLogs(message);


    // punishment stuff
    const punishment = checkData.punishment?.toLowerCase();
    if (typeof punishment !== "string") throw TypeError(`Error: punishment is type of ${typeof punishment}. Expected "string"`);
    if (punishment === "none" || punishment === "") return;
    const movement_vl = getScore(player, "motionvl", 0) + getScore(player, "flyvl", 0) + getScore(player, "speedvl", 0) + getScore(player, "predicitionvl", 0) + getScore(player, "noslowvl", 0) + getScore(player, "predictionvl", 0) + getScore(player, "invalidsprintvl", 0);
    const combat_vl = getScore(player, "reachvl", 0) + getScore(player, "killauravl", 0) + getScore(player, "aimvl", 0) + getScore(player, "autoclickervl", 0) + getScore(player, "hitboxvl", 0);
    const block_vl = getScore(player, "scaffoldvl", 0) + getScore(player, "nukervl", 0) + getScore(player, "towervl", 0);
    const other_vl = getScore(player, "badpacketsvl", 0) + getScore(player, "crashervl", 0) + getScore(player, "spammervl", 0) + getScore(player, "autototemvl", 0) + getScore(player, "autosheildvl", 0) + getScore(player, "illegalitemvl", 0);
    // This was requested by Duckie Jam (1078815334871617556)
    if (config.fancy_kick_calculation.on === true && settings.punishment.autoKick === true) {
        if (movement_vl > config.fancy_kick_calculation.movement && combat_vl > config.fancy_kick_calculation.combat && block_vl > config.fancy_kick_calculation.block && other_vl > config.fancy_kick_calculation.other) {
            player.addTag("strict");
            //setSound(player, "mob.endermen.death");
            console.warn(`${new Date().toISOString()} |${player.name} was kicked by Isolate Anticheat for ${check}/${checkType}`);
            player.runCommandAsync("function tools/resetwarns");
            // @ts-ignore
            addLogs(`§u${player.name} §hwas §pkicked §hby §nIsolate Anticheat §j[§n${check}§j]`);
            player.runCommandAsync(`kick "${player.name}" §r§uIsolate >> §6Unfair Advantage (Cheating)`);
        }
    }

    if (settings.general.smartNotify === true) {
        const total_vL = movement_vl + combat_vl + block_vl + other_vl;
        if (movement_vl > 20) player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §n${player.name} §his most likely using a form of movement cheat! (Specate with !v)"}]}`);
        else if (combat_vl === 10) player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §n${player.name} §his most likely using a form of combat cheat! (Specate with !v)"}]}`);
        else if (block_vl === 5) player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §n${player.name} §his most likely using a form of place/break cheat! (Specate with !v)"}]}`);
        else if (other_vl === 15) player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §n${player.name} §his most likely using a form of Misc cheat!"}]}`);
        else if (total_vL === 20) player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §n${player.name} §his most likely using an Unfair Advantage! (Specate with !v)"}]}`);
    }
    if (currentVl >= checkData.minVlbeforePunishment) {


        if (punishment === "kick" && (settings.punishment.autoKick) && (player.hasTag("reported") || !settings.punishment.onlyReported)) {
            let banLength2;
            try {
                setScore(player, "kickvl", kickvl + 1);
                if (kickvl > settings.punishment.kicksBeforeBan || settings.report.enabled && settings.report.kickBan && kickvl > settings.report.minKicks && player.hasTag("reported")) {
                    banPlayer(player, "§d Isolate Anticheat caught you cheating!", '7d', "§d Isolate Anticheat");
                    console.warn(`${new Date().toISOString()} |${player.name} was banned by Isolate Anticheat for ${check}/${checkType}`);
                    player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has been §cpunished§r (§cBan§r) for ${check}/${checkType}"}]}`);
                    // @ts-ignore
                    addLogs(`§u${player.name} §hwas §pbanned§h by §nIsolate Anticheat §j[§n${check}§j] | 7d`)
                    player.runCommandAsync(`kick "${player.name}"`);
                    return;
                }
                player.runCommandAsync("function tools/resetwarns");
                player.addTag("strict");
                console.warn(`${new Date().toISOString()} |${player.name} was kicked by Isolate Anticheat for ${check}/${checkType}`);
                addLogs(`§u${player.name} §hwas §pkicked §hby §nIsolate Anticheat §j[§n${check}§j]`)
                player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has been §cpunished§r (§cKick§r) for ${check}/${checkType}"}]}`);
                kickPlayer(player, `§dUnfair Advantage §t(${check})`, `§r§j[§uIsolate§j]§r >> §6Unfair Advantage.§b §j[§n${check}§j]`);
            // incase /kick fails, we despawn them from the world
            } catch (error) {
                player.triggerEvent("scythe:kick");
                console.error(error, error.stack);
            }
        };
        if (punishment === "ban" && (player.hasTag("reported") || !settings.punishment.onlyReported)) {
            // Check if auto-banning is disabled
            if (settings.punishment.autoBan) {
                const punishmentLength = checkData.punishmentLength?.toLowerCase();
                //setSound(player, "mob.enderdragon.death");
                console.warn(`${new Date().toISOString()} |${player.name} was banned by Isolate Anticheat for ${check}/${checkType}`);
                player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has been §cpunished§r (§cBan§r) for ${check}/${checkType}"}]}`);
                addLogs(`§u${player.name} §hwas §pbanned§h by §nIsolate Anticheat§b [§s${check}§b]`);
                banPlayer(player, "§d Isolate Anticheat caught you cheating! (" + check + ")", punishmentLength, "§d Isolate Anticheat");
            }
        }
        if (punishment === "mute") {
            player.addTag("isMuted");
            player.sendMessage(`§r§j[§uIsolate§j]§r You have been muted by Isolate Anticheat for Unfair Advantage!`);
            banAnimation(player, "type1");
            // remove chat ability
            player.runCommandAsync("ability @s mute true");
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has been automatically muted by Isolate Anticheat for Unfair Advantage. Check: ${check}/${checkType}"}]}`);
        }
        // Testing mode
        if (punishment === "kick" && settings.general.testingmode) {
            setTitle(player, "You would have been kicked", `Check: ${check}/${checkType}`);
            player.runCommandAsync("function tools/resetwarns");
        }
        if (punishment === "ban" && settings.general.testingmode) {
            setTitle(player, "You would have been banned", `Check: ${check}/${checkType}`);
            player.runCommandAsync("function tools/resetwarns");
        }
    }
}

function buildDisplayBar(currentVl, maxVl, filledColor, unfilledColor) {
    let displayBar = "";
    let filled, unfilled;

    if (maxVl <= 10) {
        filled = currentVl;
        unfilled = maxVl - currentVl;
    } else {
        let percent = currentVl / maxVl;
        filled = isomath.round(percent * 10);
        unfilled = 10 - filled;
    }

    for (let i = 0; i < filled; i++) {
        displayBar += filledColor;
    }

    for (let i = 0; i < unfilled; i++) {
        displayBar += unfilledColor;
    }

    return displayBar;
}

function buildNotification(player, theme, check, checkType, hackType, debug, debugName, currentVl, maxVl) {
    const { flagstyle, debugflag } = settings.general;
    const style = themeStyles[theme];
    
    if (!style) return;

    let notification = `${style.prefix} ${style.playerName}${player.nameTag} ${style.failMessage}[${hackType}] ${style.checkColour}${check}${style.separator}${checkType.toUpperCase()}${style.holder}`;

    // Include debug information if debug flag is enabled
    if (debugflag) {
        notification += ` ${style.debugColor}(${debugName}=${debug})§h `;
    } else {
        notification += '§h. ';
    }

    // Add flag style specific information
    if (flagstyle === "1") {
        notification += `[${style.currentVlFormat}${currentVl}§h]`;
    } else if (flagstyle === "2") {
        let displayBar = buildDisplayBar(currentVl, maxVl, style.filledColor, style.unfilledColor);
        notification += `[${displayBar}§h]`;
    }

    return notification;
}

export function sendNotification(player, theme, check, checkType, hackType, debug, debugName, currentVl, maxVl) {
    const notification = buildNotification(player, theme, check, checkType, hackType, debug, debugName, currentVl, maxVl);

    // Send the notification with a single tellraw command
    player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"${notification}"}]}`);
}