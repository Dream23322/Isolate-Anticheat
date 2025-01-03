import * as Minecraft from "@minecraft/server";
import { getScore, setScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getDeltaPitch, getDeltaYaw, getLastDeltaPitch, getLastDeltaYaw } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { abs } from "../../../utils/maths/isomath.js";
const data = new Map();
/**
 * Aim A check.
 * This checks for large headsnaps with no acceleration or decelleration, which is hard to achieve while legit.
 * It can detect some blatant aimbot and killaura cheats.
 * @param {Minecraft.Player} player - The player to check.
 */
export function aim_a(player) {
    if(!allowedPlatform(player, config.modules.aimA.AP)) return;
    if(config.modules.aimA.enabled) {
        // Get delta yaw and pitch
        const deltaPitch = getDeltaPitch(player);
        const deltaYaw = getDeltaYaw(player);

        // Get last delta yaw
        const deltaYaw2 = getLastDeltaYaw(player);
        
        // Calculate the accelerationaw
        const yawAccel = abs(deltaYaw - deltaYaw2);

        // If the player is not moving, skip this iteration
        if(deltaYaw === 0 && deltaPitch === 0) return;

        // Check for extreme yaw acceleration (possibly indicative of a killaura)
        if(deltaYaw > 35 && yawAccel < 0.01 && (player.hasTag("attacking") || !config.modules.aimA.needHit)) {
            flag(player, "Aim", "A", "Combat (BETA)", "Yaw", `${deltaYaw},Accel=${yawAccel}`, false);
        }
    }

}
