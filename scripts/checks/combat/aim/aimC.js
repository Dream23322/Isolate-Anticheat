import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs } from "../../../utils/fastMath.js";
const data = new Map();
/**
 * The aim_c function checks for suspicious aiming patterns in players' rotation data.
 * It uses a circular buffer to keep track of the player's last 3 pitch and yaw rotations.
 * It calculates the absolute difference in pitch and yaw between consecutive rotations
 * and checks if these differences meet certain criteria.
 * If the buffer score exceeds a certain threshold, the player is flagged.
 * @param {Minecraft.Player} player - The player object to check.
 */
export function aim_c(player) {
    // Only run if the Aim C module is enabled
    if(config.modules.aimC.enabled) {
        // Get the player's current rotation
        const rot = player.getRotation();
        // Check if the player's data is stored in the circular buffer
        if(data.has(player.name)) {
            // Get the player's last 3 pitch and yaw rotations from the circular buffer
            const pitchData = data.get(player.name).pitch;
            const yawData = data.get(player.name).yaw;
            // Get the buffer score for the player
            const bufferVal = getScore(player, "aim_c_buffer", 0);
            // Only run if the pitch and yaw data is available
            if(pitchData && yawData) {
                // Calculate the absolute difference in pitch and yaw between the current and previous rotations
                const deltaPitch = fastAbs(rot.x - pitchData.one);
                const deltaYaw = fastAbs(rot.y - yawData.one);
                // Calculate the absolute difference in pitch and yaw between the previous and second previous rotations
                const lastDeltaPitch = fastAbs(pitchData.one - pitchData.two);
                const lastDeltaYaw = fastAbs(yawData.one - yawData.two);
                const lastLastDeltaPitch = fastAbs(pitchData.two - pitchData.three);
                const lastLastDeltaYaw = fastAbs(yawData.two - yawData.three);
                // Check if the current rotation is within a certain threshold of the previous rotation
                if(
                    deltaYaw < 1.5 &&
                    lastDeltaYaw > 50 &&
                    lastLastDeltaYaw < 1.5 && 
                    deltaPitch < 40 ||
                    deltaPitch < 1.5 &&
                    lastDeltaPitch > 50 &&
                    lastLastDeltaPitch < 1.5 && 
                    fastAbs(deltaPitch) > 60
                ) {
                    // Increment the buffer score for the player
                    setScore(player, "aim_c_buffer", bufferVal + 1);
                    // Log the buffer score for debugging purposes
                    console.warn(`${player.name} | Aim C Buffer: ${getScore(player, "aim_c_buffer", 0)}`);
                }
                // Check if the buffer score exceeds the threshold for the Aim C module
                if(getScore(player, "aim_c_buffer", 0) > config.modules.aimC.buffer) {
                    // Flag the player with the Aim C module and the rotation data
                    flag(player, "Aim", "C", "Combat (BETA)", "Accel", `${deltaYaw},${deltaPitch}`, false);
                    // Reset the buffer score for the player
                    setScore(player, "aim_c_buffer", 0);
                }
            }
        }
        // Store the player's current rotation in the circular buffer
        data.set(player.name, {
            pitch: {
                one: rot.x,
                two: data.get(player.name)?.pitch?.one,
                three: data.get(player.name)?.pitch?.two,
                four: data.get(player.name)?.pitch?.three
            },
            yaw: {
                one: rot.y,
                two: data.get(player.name)?.yaw?.one,
                three: data.get(player.name)?.yaw?.two,
                four: data.get(player.name)?.yaw?.three
            }
        });
    }
}

