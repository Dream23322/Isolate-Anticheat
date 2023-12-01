import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

// Make the map to store data
const lastUpdateTime = new Map();
const lastpos = new Map();
export function motion_d(player) {
    const playerVelocity = player.getVelocity();
    const playerSpeed = getSpeed(player);
    const now = Date.now();
    if(lastUpdateTime.get(player) && !player.hasTag("stairs")) {
        let max_value = 40
        const timeElapsed = now - lastUpdateTime.get(player)
        const lastPos = lastpos.get(player);
        // Calculate predicted position based on velocity
        const predictedX = lastPos.x + playerVelocity.x * timeElapsed / 1000.0;
        const predictedY = lastPos.y + playerVelocity.y * timeElapsed / 1000.0;
        const predictedZ = lastPos.z + playerVelocity.z * timeElapsed / 1000.0;

        // Get the actual position reported by the client
        const actualX = player.location.x;
        const actualY = player.location.y;
        const actualZ = player.location.z;
        if((player.hasTag("damaged") && !player.hasTag("fall_damage"))) {
            max_value + 50;
        }
        // Calculate the distance between predicted and actual positions
        const distance = Math.sqrt((predictedX - actualX) ** 2 + (predictedY - actualY) ** 2 + (predictedZ - actualZ) ** 2);

        if(config.modules.motionD.enabled && playerSpeed !== 0 && (Math.abs(lastPos.x - actualX) + Math.abs(lastPos.z - actualZ)) / 2 < 5 && !player.hasTag("placing") && !player.hasTag("slime") && player.fallDistance < 3 && !player.getEffect("speed")) {
        // Check if the distance exceeds the allowed limit
            if (distance > 50 * timeElapsed / 1000.0) {
                // Possible cheating detected, take appropriate action
                flag(player, "Motion", "D", "Movement", "speed", playerSpeed, false);
            }
        }
    }
    lastUpdateTime.set(player, Date.now());
    lastpos.set(player, {x: player.location.x, y: player.location.y, z: player.location.z});
}
