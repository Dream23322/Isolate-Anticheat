// @ts-check

import * as Minecraft from "@minecraft/server";
import config from "./data/config.js";
import data from "./data/data.js";
import { setParticle, setSound } from "./utils/gameUtil.js";


const world = Minecraft.world;
export function crashPlayer(player) {
    player.runCommandAsync("title @s title §4§k§lad;lkfjasdflkajdsklfjadsklfjasdlk;fjaslk;djlkasdjflkasjdflkajsdf");
    player.runCommandAsync("title @s subtitle §4§k§lad;lkfjasdflkajdsklfjadsklfjasdlk;fjaslk;djlkasdjflkasjdflkajsdf");
    player.runCommandAsync("title @s actionbar §4§k§lad;lkfjasdflkajdsklfjadsklfjasdlk;fjaslk;djlkasdjflkasjdflkajsdf");
    for(let i = 0; i < 5; i++) {
        //player.runCommandAsync(`particle minecraft:huge_explosion_emitter ~ ~ ~`);
        player.runCommandAsync(`particle minecraft:villager_angry ~ ~1 ~`);
       // player.runCommandAsync(`particle minecraft:huge_explosion_emitter ~ ~2 ~`);
        //player.runCommandAsync(`particle minecraft:huge_explosion_emitter ~ ~1 ~`);
       // player.runCommandAsync(`particle minecraft:huge_explosion_emitter ~1 ~ ~`);
        player.runCommandAsync(`particle minecraft:lava_particle ~ ~ ~`);
        player.runCommandAsync(`particle minecraft:lava_particle ~ ~ ~`);
        //player.runCommandAsync(`particle minecraft:huge_explosion_emitter ~ ~ ~`);
        player.runCommandAsync(`particle minecraft:totem_particle ~ ~2 ~`);
        player.runCommandAsync("particle minecraft:lava_particle ~ ~ ~");
        player.runCommandAsync("particle minecraft:totem_particle ~ ~ ~");
        player.runCommandAsync("particle minecraft:totem_particle ~ ~ ~");
        player.runCommandAsync("particle minecraft:note_particle ~ ~ ~");
        player.runCommandAsync("particle minecraft:explode ~ ~ ~");
        player.runCommandAsync("particle minecraft:shriek_particle ~ ~ ~");
        
    }
}

export async function banAnimation(player, type) {
    const banMessages = {
      "type1": {
        title: "§4§k§l EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        subtitle: "§4§k§lEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        actionbar: "§4§k§l EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        particle: "huge_explosion_emitter"
      },
      "type2": {
        title: "§c§k§l EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        subtitle: "§c§k§l  EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        actionbar: "§c§k§l EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        particle: "villager_angry"
      },
      "type3": {
        title: "§b§l§kEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        subtitle: "§b§l§kEEEEEEEEEEEEEEEEEEEEEEEEE",
        actionbar: "§b§l§kEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        particle: "totem_particle"
      }
    };
  
    const banMessage = banMessages[type];
  
    // Send title, subtitle, and EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEs to the player
    player.runCommand(`title "${player.name}" title ${banMessage.title}`);
    player.runCommand(`tp "${player.name}" "${player.name}"`);
    player.runCommand(`title "${player.name}" subtitle ${banMessage.subtitle}`);
    player.runCommand(`tp "${player.name}" "${player.name}"`);
    player.runCommand(`title "${player.name}" actionbar ${banMessage.actionbar}`);
    player.runCommand(`tp "${player.name}" "${player.name}"`);


    player.sendMessage(banMessage.actionbar);

    player.sendMessage(banMessage.actionbar);

    // Type 2 is an animation explosion with angry villager
    if(type === "type2") {
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~1 ~1 ~1`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~-1 ~-1 ~-1`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~-1 ~1 ~1`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~-1 ~1 ~`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~1 ~ ~-1`);
        
    } else {
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~ ~ ~`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~ ~ ~`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~ ~ ~`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~ ~ ~`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~ ~ ~`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~ ~ ~`);
    }
}



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
    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if(typeof check !== "string") throw TypeError(`Error: check is type of ${typeof check}. Expected "string"`);
    if(typeof checkType !== "string") throw TypeError(`Error: checkType is type of ${typeof checkType}. Expected "string"`);
    if(typeof hackType !== "string") throw TypeError(`Error: hackType is type of ${typeof hackType}. Expected "string"`);
    if(typeof debugName !== "string" && typeof debugName !== "undefined") throw TypeError(`Error: debugName is type of ${typeof debugName}. Expected "string" or "undefined"`);
    if(typeof debug !== "string" && typeof debug !== "number" && typeof debug !== "undefined") throw TypeError(`Error: debug is type of ${typeof debug}. Expected "string", "number" or "undefined"`);
    if(typeof shouldTP !== "boolean") throw TypeError(`Error: shouldTP is type of ${typeof shouldTP}. Expected "boolean"`);
    if(typeof cancelObject !== "object" && typeof cancelObject !== "undefined") throw TypeError(`Error: cancelObject is type of ${typeof cancelObject}. Expected "object" or "undefined`);
    if(typeof slot !== "number" && typeof slot !== "undefined") throw TypeError(`Error: slot is type of ${typeof slot}. Expected "number" or "undefined`);

    if(config.disable_flags_from_isolate_op && player.hasTag("op")) return;

    if(debug) {
        // remove characters that may break commands, and newlines
        debug = String(debug).replace(/"|\\|\n/gm, "");

        // malicious users may try make the debug field ridiculously large to lag any clients that may
        // try to view the alert (anybody with the 'notify' tag)
        if(debug.length > 256) {
            const extraLength = debug.length - 256;
            debug = debug.slice(0, -extraLength) + ` (+${extraLength} additional characters)`;
        }
    }

    const rotation = player.getRotation();

    // If debug is enabled, then we log everything we know about the player.
    if(config.debug && player.hasTag("debugFlags")) {
        const currentItem = player.getComponent("inventory").container.getItem(player.selectedSlot);
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
                selectedSlot: player.selectedSlot,
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
    if(cancelObject) cancelObject.cancel = true;



    if(shouldTP && config.modules.settings.silent === false) player.teleport(check === "Crasher" ? {x: 30000000, y: 30000000, z: 30000000} : player.lastGoodPosition, {dimension: player.dimension, rotation: {x: rotation.x, y: rotation.y}, keepVelocity: false});

   

    const scoreboardObjective = check === "CommandBlockExploit" ? "cbevl" : `${check.toLowerCase()}vl`;

    if(!world.scoreboard.getObjective(scoreboardObjective)) {
        world.scoreboard.addObjective(scoreboardObjective, scoreboardObjective);
    }

    let currentVl = getScore(player, scoreboardObjective, 0);
    setScore(player, scoreboardObjective, currentVl + 1);

    currentVl++;
    console.warn("[Isolate]", player.name, check,"[",checkType,"]", hackType, "-", debugName, debug, "VL=", currentVl);
    const thememode = config.modules.settings.theme;
    if(thememode == "1") {
        if(config.modules.settings.debugflag) {
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag}§r §nhas failed §3[${hackType}] §u${check}§b/§h${checkType.toUpperCase()} §9(${debugName}=${debug}§r§7)§h. [§jx§9${currentVl}§h]"}]}`);

        } else {
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag}§r §nhas failed §3[${hackType}] §u${check}§b/§h${checkType.toUpperCase()}§h. [§jx§9${currentVl}§h]"}]}`);
        }
    } else if(thememode == "2") {
        if(config.modules.settings.debugflag) {
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag}§r §hhas failed §t[${hackType}] §u${check}§8/§i${checkType.toUpperCase()} §9(${debugName}=${debug}§r§7)§h. [§dx§u${currentVl}§h]"}]}`);
        } else {
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag}§r §hhas failed §t[${hackType}] §u${check}§8/§i${checkType.toUpperCase()}§h. [§dx§u${currentVl}§h]"}]}`);     
        }
    }

   
    
    if(typeof slot === "number") {
		const container = player.getComponent("inventory").container;
		container.setItem(slot, undefined);
	}

    const checkData = config.modules[check.toLowerCase() + checkType.toUpperCase()];
    if(!checkData) throw Error(`No valid check data found for ${check}/${checkType}.`);
    const kickvl = getScore(player, "kickvl", 0);
    if(!checkData.enabled) throw Error(`${check}/${checkType} was flagged but the module was disabled.`);
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
    
    // Push the new message
    // @ts-ignore
    data.recentLogs.push(message);
    

    // punishment stuff
    const punishment = checkData.punishment?.toLowerCase();
    if(typeof punishment !== "string") throw TypeError(`Error: punishment is type of ${typeof punishment}. Expected "string"`);
    if(punishment === "none" || punishment === "") return;

    // This was requested by Duckie Jam (1078815334871617556) from Appy's Practice Network (Code: KC2AfnqpLPo )
    // That realm is ded btw
    if(config.fancy_kick_calculation.on === true) {
        const movement_vl = getScore(player, "motionvl", 0) + getScore(player, "flyvl", 0) + getScore(player, "speedvl", 0) + getScore(player, "predicitionvl", 0) + getScore(player, "noslowvl", 0) + getScore(player, "predictionvl", 0) + getScore(player, "invalidsprintvl", 0);
        const combat_vl = getScore(player, "reachvl", 0) + getScore(player, "killauravl", 0) + getScore(player, "aimvl", 0) + getScore(player, "autoclickervl", 0) + getScore(player, "hitboxvl", 0);
        const block_vl = getScore(player, "scaffoldvl", 0) + getScore(player, "nukervl", 0) + getScore(player, "towervl", 0);
        const other_vl = getScore(player, "badpacketsvl", 0) + getScore(player, "crashervl", 0) + getScore(player, "spammervl", 0) + getScore(player, "autototemvl", 0) + getScore(player, "autosheildvl", 0) + getScore(player, "illegalitemvl", 0);
        if(movement_vl > config.fancy_kick_calculation.movement && combat_vl > config.fancy_kick_calculation.combat && block_vl > config.fancy_kick_calculation.block && other_vl > config.fancy_kick_calculation.other) {
            player.addTag("strict");
            //setSound(player, "mob.endermen.death");
            console.warn(`${new Date().toISOString()} |${player.name} was kicked by Isolate Anticheat for ${check}/${checkType}`);
            const message = `§u${player.name} §hwas §pkicked §hby §nIsolate Anticheat §j[§n${check}§j]`;
            player.runCommandAsync("function tools/resetwarns");
            data.recentLogs.push(message)
            player.runCommandAsync(`kick "${player.name}" §r§uIsolate >> §6Unfair Advantage (Cheating)`);
        }
    }
    if(currentVl > checkData.minVlbeforePunishment) {


        if (punishment === "kick" && config.modules.settings.autoKick) {
            let banLength2;
            try {
                //banAnimation(player, "type2");
                setScore(player, "kickvl", kickvl + 1);
                if(kickvl > config.modules.settings.kicksBeforeBan) {
                    player.addTag("by:§d Isolate Anticheat");
                    player.addTag(`reason:§c Isolate Anticheat caught you cheating!`);
                    banLength2 = parseTime("7d");
                    player.addTag(`time:${Date.now() + banLength2}`);
                    player.addTag("isBanned");
                    setScore(player, "kickvl", 0);
                    console.warn(`${new Date().toISOString()} |${player.name} was banned by Isolate Anticheat for ${check}/${checkType}`);
                    const message = `§u${player.name} §hwas §pbanned§h by §nIsolate Anticheat §j[§n${check}§j]`;
                    player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} was §cpunished§r. (§cBan§r) [§u${check}§g/§9${checkType}§r]"}]}`);
                    player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r A player has been banned from your game for using an §6unfair advantage! (7-Day)"}]}`);
            
                    data.recentLogs.push(message)
                    player.runCommandAsync(`kick "${player.name}"`);
                    return;
                }
                player.runCommandAsync("function tools/resetwarns");
                player.addTag("strict");
                console.warn(`${new Date().toISOString()} |${player.name} was kicked by Isolate Anticheat for ${check}/${checkType}`);
                const message = `§u${player.name} §hwas §pkicked §hby §nIsolate Anticheat §j[§n${check}§j]`;
    
                data.recentLogs.push(message)
                
                player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} was §cpunished§r. (§6Kick§r) [§u${check}§g/§9${checkType}§r]"}]}`);
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r A player has been removed from your game for using an §6unfair advantage!"}]}`);
                player.runCommandAsync(`kick "${player.name}" §r§j[§uIsolate§j]§r >> §6Unfair Advantage.§b §j[§n${check}§j]`);
                // incase /kick fails, we despawn them from the world
            } catch (error) {
                player.triggerEvent("scythe:kick");
                console.error(error, error.stack);
            }    

        };
        if(punishment === "ban") {
            // Check if auto-banning is disabled
            if(config.modules.settings.autoBan) {

                const punishmentLength = checkData.punishmentLength?.toLowerCase();
                //setSound(player, "mob.enderdragon.death");
                console.warn(`${new Date().toISOString()} |${player.name} was banned by Isolate Anticheat for ${check}/${checkType}`);
                player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} was §cpunished§r. (§cBan§r) [§u${check}§g/§9${checkType}§r]"}]}`);

                // this removes old ban stuff
                player.getTags().forEach(t => {
                    if(t.includes("reason:") || t.includes("by:") || t.includes("time:")) player.removeTag(t);
                });

                let banLength;

                
                const message = `§u${player.name} §hwas §pbanned§h by §nIsolate Anticheat§b [§s${check}§b]`;
    
                data.recentLogs.push(message)
                
                
                player.addTag("by:§d Isolate Anticheat");
                player.addTag(`reason:§c Isolate Anticheat detected §6Unfair Advantage§c! §b [§s${check}§b]`);
                try {
                    banLength = parseTime(punishmentLength);
                    player.addTag(`time:${Date.now() + banLength}`);
                } catch (error) {}
                
                player.addTag("isBanned");
                player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r A player has been banned from your game for using an §6unfair advantage!"}]}`);
            }

        }
        if (punishment === "mute") {
            player.addTag("isMuted");
            player.sendMessage(`§r§j[§uIsolate§j]§r You have been muted by Isolate Anticheat for Unfair Advantage!`);
            banAnimation(player, "type1")
            // remove chat ability
            player.runCommandAsync("ability @s mute true");

            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has been automatically muted by Isolate Anticheat for Unfair Advantage. Check: ${check}/${checkType}"}]}`);
        
        }
        
    }    
}


/**
 * @name banMessage
 * @param {Minecraft.Player} player - The player object
 * @example banMessage(player);
 * @remarks Bans the player from the game.
 */


export function banMessage(player) {
    // validate that required params are defined
    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);

    // @ts-expect-error
    if(config.flagWhitelist.includes(player.name) && player.hasTag("op")) return;

    // @ts-expect-error
    if(data.unbanQueue.includes(player.name.toLowerCase().split(" ")[0])) {
        player.removeTag("isBanned");

        player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has been found in the unban queue and has been unbanned."}]}`);

        player.getTags().forEach(t => {
            if(t.includes("reason:") || t.includes("by:") || t.includes("time:")) player.removeTag(t);
        });

        // remove the player from the unban queue
        for (let i = -1; i < data.unbanQueue.length; i++) {
            if(data.unbanQueue[i] !== player.name.toLowerCase().split(" ")[0]) continue;

            data.unbanQueue.splice(i, 1);
            break;
        }
        return;
    }

    let reason;
    let by;
    let time;

    player.getTags().forEach(t => {
        if(t.includes("by:")) by = t.slice(3);
            else if(t.includes("reason:")) reason = t.slice(7);
            else if(t.includes("time:")) time = t.slice(5);
    });


    if(time) {
        if(time < Date.now()) {
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name}'s ban has expired and has now been unbanned."}]}`);

            // ban expired, woo
            player.removeTag("isBanned");
            player.getTags().forEach(t => {
                if(t.includes("reason:") || t.includes("by:") || t.includes("time:")) player.removeTag(t);
            });
            return;
        }

        time = msToTime(Number(time));
        time = `${time.w} weeks, ${time.d} days, ${time.h} hours, ${time.m} minutes, ${time.s} seconds`;
    }

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} was kicked for being banned. Ban Reason: ${reason || "You are banned!"}."}]}`);
    try {
        for (let i = 0; i < 3; i++) {
            player.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        }
        player.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        player.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        player.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");     
        for (let i = 0; i < 30; i++) {
            player.runCommandAsync(`tp "${player.name}" "${player.name}"`);
        }
        
        player.runCommandAsync(`kick "${player.name}" §r\n§l§cYOU ARE BANNED!\n§mBanned By:§r ${by || "N/A"}\n§bReason:§r ${reason || "N/A"}\n§aBan Length:§r ${time || "Permanant"}`);
    } catch (error) {
        player.triggerEvent("scythe:kick");
    }    
    
}

/**
 * @name getClosestPlayer
 * @param {object} entity - The entity to check
 * @example getClosestPlayer(entity);
 * @remarks Gets the nearest player to an entity.
 * @returns {object} player - The player that was found
 */
export function getClosestPlayer(entity) {
    // validate that required params are defined
    if(typeof entity !== "object") return TypeError(`Error: entity is type of ${typeof entity}. Expected "object"`);

    const nearestPlayer = [...entity.dimension.getPlayers({
        closest: 1,
        location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
    })][0];

    return nearestPlayer;
}

/**
 * @name parseTime
 * @param {string} str - The time value to convert to milliseconds
 * @example parseTime("24d"); // returns 2073600000
 * @remarks Parses a time string into milliseconds.
 * @returns {number | null} str - The converted string
 */
export function parseTime(str) {
    // validate that required params are defined
    if(typeof str !== "string") throw TypeError(`Error: str is type of ${typeof str}. Expected "string"`);

    // parse time values like 12h, 1d, 10m into milliseconds
    const time = str.match(/^(\d+)([smhdwy])$/);

    if(time) {
        const [, num, unit] = time;
        const ms = {
            s: 1000,
            m: 60000,
            h: 3600000,
            d: 86400000,
            w: 604800000,
            y: 31536000000
        }[unit];
        return ms * Number(num);
    }
    return time;
}

/**
 * @name msToTime
 * @param {number} ms - The string to convert
 * @example str(88200000); // Returns { d: 1, h: 0, m: 30, s: 0 }
 * @remarks Convert milliseconds to seconds, minutes, hours, days and weeks
 * @returns {object} str - The converted string
 */
export function msToTime(ms) {
    // validate that required params are defined
    if(typeof ms !== "number") throw TypeError(`Error: ms is type of ${typeof ms}. Expected "number"`);

    if(ms > Date.now()) ms = ms - Date.now();

    // turn milliseconds into days, minutes, seconds, etc
    const w = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
    const d = Math.floor((ms % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return {
        w: w,
        d: d,
        h: h,
        m: m,
        s: s
    };
}

/**
 * @name getScore
 * @param {Minecraft.Entity} player - The player to get the scoreboard value from
 * @param {string} objective - The player to get the scoreboard value from
 * @param {number} [defaultValue] - Default value to return if unable to get scoreboard score
 * @example getScore(player, "cbevl", 0)
 * @remarks Get's the scoreboard objective value for a player
 * @returns {number} score - The scoreboard objective value
 */
export function getScore(player, objective, defaultValue = 0) {
    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if(typeof objective !== "string") throw TypeError(`Error: objective is type of ${typeof objective}. Expected "string"`);
    if(typeof defaultValue !== "number") throw TypeError(`Error: defaultValue is type of ${typeof defaultValue}. Expected "number"`);

    try {
       return world.scoreboard.getObjective(objective).getScore(player) ?? defaultValue;
    } catch {
        return defaultValue;
    }
}

/**
 * @name setScore
 * @param {import("@minecraft/server").Entity} player - The player to set the score for
 * @param {string} objectiveName - The scoreboard objective
 * @param {number} value - The new value of the scoreboard objective
 * @example getScore(player, "cbevl", 0)
 * @remarks Sets the scoreboard objective value for a player
 */
export function setScore(player, objectiveName, value) {
    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if(typeof objectiveName !== "string") throw TypeError(`Error: objective is type of ${typeof objectiveName}. Expected "string"`);
    if(typeof value !== "number") throw TypeError(`Error: value is type of ${typeof value}. Expected "number"`);

    const objective = world.scoreboard.getObjective(objectiveName);
    if(!objective) {
        player.runCommandAsync(`scoreboard objectives add ${objectiveName} dummy`)
    }
    objective.setScore(player, value);
}

export function capitalizeFirstLetter(string) {
	return string[0].toUpperCase() + string.slice(1);
}

/**
 * @name debug
 * @remarks Tells specified player debug data
 */
export function debug(player, data) {
    player.sendMessage("[DEBUG] " + data);
}