import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

export function motion_e(player) {
    const playerSpeed = getSpeed(player);
    const now = Date.now();
    const timeElapsed = now - player.lastUpdateTime;

    // Calculate predicted position based on velocity
    const predictedX = player.lastX + player.velocity.x * timeElapsed / 1000.0;
    const predictedY = player.lastY + player.velocity.y * timeElapsed / 1000.0;
    const predictedZ = player.lastZ + player.velocity.z * timeElapsed / 1000.0;

    // Get the actual position reported by the client
    const actualX = player.currentX;
    const actualY = player.currentY;
    const actualZ = player.currentZ;

    // Calculate the distance between predicted and actual positions
    const distance = Math.sqrt((predictedX - actualX) ** 2 + (predictedY - actualY) ** 2 + (predictedZ - actualZ) ** 2);

    // Update the last known position and time
    player.lastX = actualX;
    player.lastY = actualY;
    player.lastZ = actualZ;
    player.lastUpdateTime = now;

    if(config.modules.motion_e.enabled) {
    // Check if the distance exceeds the allowed limit
        if (distance > MAX_ALLOWED_SPEED * timeElapsed / 1000.0) {
        // Possible cheating detected, take appropriate action
        flag(player, "Motion", "E", "Movement", "speed", playerSpeed, false);
        }
    }
}
