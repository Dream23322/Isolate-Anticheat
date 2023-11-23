import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

export function badpackets_e(player, lastPosition) {
    const playerVelocity = player.getVelocity();
    const playerSpeed = getSpeed(player);
    // BadPackets/E = Checks for a disabler on Vector client that can bypasss 90% of movement checks
    // Average ratted client :skull:
    if(config.modules.badpacketsE.enabled) {
        if(lastPosition.get(player)) {
            const diffx = Math.abs(lastPosition.get(player).x - player.location.x);
            const diffz = Math.abs(lastPosition.get(player).z - player.location.z);
            if(playerSpeed === 0 && diffx > 0.5 && diffz > 0.5 && playerVelocity.y !== 0) {
                flag(player, "BadPackets", "E", "Movement", "speed", playerSpeed, true);
            }
            const diff = Math.abs((diffx + diffz) / 2)
            if(player.hasTag("testing")) {
                console.log(`Diff: ${diff}`);
            }   
            if(diff > 8 && playerSpeed < 0.3 && diff < 4 && playerSpeed !== 0) {
                flag(player, "BadPackets", "E", "Movement", "Speed", `${playerSpeed},diff=${diff}`, true);
            }
        }

        // Set new values
        lastPosition.set(player, {x: player.location.x, y: player.location.y, z: player.location.z});
        // I don't feel like making a whole new check for this
        if(playerVelocity.y === 0 && playerVelocity.isJumping) {
            flag(player, "BadPackets", "E", "Movement", "yVelocity", playerVelocity.y, false);
        }
    }
}