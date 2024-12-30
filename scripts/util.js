// @ts-check

// @ts-ignore
import * as Minecraft from "@minecraft/server";
import settings from "./data/settings.js";
// @ts-ignore
import * as isomath from "./utils/maths/isomath.js";

export const world = Minecraft.world;

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
    const w = isomath.floor(ms / (1000 * 60 * 60 * 24 * 7));
    const d = isomath.floor((ms % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    const h = isomath.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = isomath.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = isomath.floor((ms % (1000 * 60)) / 1000);
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
  
    player.runCommand(`title "${player.name}" actionbar ${banMessage.actionbar}`);
    player.runCommand(`tp "${player.name}" "${player.name}"`);
    player.sendMessage(banMessage.actionbar);

    // Type 2 is an animation explosion with angry villager
    if(type === "type2") {
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~1 ~1 ~1`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~-1 ~-1 ~-1`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~-1 ~1 ~1`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~-1 ~1 ~`);
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~1 ~ ~-1`);
        
    } else {
        const particle = `minecraft:${banMessage.particle}`;
        for (let i = 0; i < 6; i++) {
            player.runCommandAsync(`particle ${particle} ~ ~ ~`);
        }
        player.runCommandAsync(`particle minecraft:${banMessage.particle} ~ ~ ~`);
    }
}

export function crashPlayer(player) {
    // LOL TY ZQSOC
    player.sendMessage("§r§j[§uIsolate§j]§r §1§l#GG #LAWL");
    player.onScreenDisplay.setTitle(`${"§4§k§lad;lkfjasdflkajdsklfjadsklfjasdlk;fjaslk;djlkasdjflkasjdflkajsdf".repeat(999999)}`);
}