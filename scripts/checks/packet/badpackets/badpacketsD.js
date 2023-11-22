import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function badpackets_d(player, lastPlayerYawRotations, lastYawDiff) {
    // Checks for derp rotation (Really fast)
    if(config.modules.badpacketsD.enabled) {
        const currentRotation = player.getRotation();


        const yawDiff = Math.abs(currentRotation.y - lastPlayerYawRotations.get(player));
        if(player.hasTag("logDiff")) {
            console.warn(`${new Date().toISOString()} |${player.name} rot diff = ${yawDiff}!`)
        }
        // Check for the condition
        // So, with the derp module, it changes the players rotation by 4 or 2, so its really really really easy to detect
        // There is another mode on it which BadPackets/F tries to detect, but its hard because of how it works
        if (yawDiff === 2 && lastYawDiff.get(player) === 4 || yawDiff === 4 && lastYawDiff.get(player) === 2 || yawDiff === 2 && lastYawDiff.get(player) === 2) {
            flag(player, "BadPackets", "D", "Rotation", "yawdiff", yawDiff, false)
            
        }

        // Update stored rotations
        lastPlayerYawRotations.set(player, currentRotation.y);
        lastYawDiff.set(player, yawDiff);
        
    }
}