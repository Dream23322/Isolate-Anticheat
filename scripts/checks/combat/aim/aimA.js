import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs } from "../../../utils/fastMath.js";
import { getDeltaPitch, getDeltaYaw, getLastDeltaPitch, getLastDeltaYaw } from "./aimData.js";
const data = new Map();
/**
 * Aim A check.
 * This check tracks the player's pitch and yaw rotation over time to detect suspicious aiming patterns.
 * It can detect aimbots and aim assistants.
 * @param {Minecraft.Player} player - The player to check.
 */
export function aim_a(player) {
    const rot = player.getRotation();
    // Only run if the Aim A module is enabled and the player's data is available
    if(config.modules.aimA.enabled) {
        // Only run if the player's pitch and yaw data is available
        if(true) {
            // Calculate the absolute difference in pitch and yaw between the current and previous rotations
            const deltaPitch = getDeltaPitch(player);
            const deltaYaw = getDeltaYaw(player);

            // Calculate the absolute difference in pitch and yaw between the previous and second previous rotations
            const deltaPitch2 = getLastDeltaPitch(player);
            const deltaYaw2 = getLastDeltaYaw(player);
            
            // Calculate the acceleration in pitch and yaw
            const yawAccel = fastAbs(deltaYaw - deltaYaw2);
            const pitchAccel = fastAbs(deltaPitch - deltaPitch2);

            // If the player is not moving, skip this iteration
            if(deltaYaw == 0 && deltaPitch == 0) return;

            const invalidYaw = yawAccel < 0.1 && fastAbs(deltaYaw) > 1.5;
            const invalidPitch = pitchAccel < 0.1 && fastAbs(deltaPitch) > 1.5;

            // Check for suspicious aiming patterns
            if(deltaPitch > 15 && config.modules.aimA.diff < 0.05 || deltaPitch < config.modules.aimA.diff && (deltaYaw > 15 && deltaYaw < 25 || deltaYaw > 250) && deltaYaw2 > 15 && deltaPitch2 < 0 || (invalidYaw || invalidPitch)) {
                // Increment the aim buffer score
                setScore(player, "aim_a_buffer", getScore(player, "aim_a_buffer", 0) + 1);
            }
            // Send debug messages if the player has the "aim_debug" tag
            if(player.hasTag("aim_debug")) player.sendMessage("Yaw: " + deltaYaw.toFixed(4) + " Pitch: " + deltaPitch.toFixed(5));
            // Flag the player if the aim buffer score exceeds the threshold and the player has the "strict" tag
            if(getScore(player, "aim_a_buffer", 0) > config.modules.aimA.buffer && player.hasTag("strict") &&  (player.hasTag("attacking") || !config.modules.aimA.needHit)) {
                flag(player, "Aim", "A", "Combat (BETA)", "Delta", `${deltaYaw},${deltaPitch},Accel=${yawAccel},${pitchAccel}`, false);
                setScore(player, "aim_a_buffer", 0);
            }
            // Check for extreme yaw acceleration (possibly indicative of a killaura)
            if(deltaYaw > 35 && yawAccel < 0.01 && (player.hasTag("attacking") || !config.modules.aimA.needHit)) {
                flag(player, "Aim", "A", "Combat (BETA)", "Yaw", `${deltaYaw},Accel=${yawAccel}`, false);
            }
        }
    }

}
