import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getScore } from "../../../util";

export function killaura_a(player, entity) {
	// Idea from Matrix Anticheat
    // github.com/jasonlaubb/Matrix-Anticheat/
    // good anticheat tbh
    if(config.modules.killauraE.enabled) {
        const playerVelocity = player.getVelocity();
        const rot = player.getRotation();
        // Stop false flags
        if(!player.isGliding && Math.hypot(playerVelocity.x, playerVelocity.z) > 0.2) {
            // Check rotation for aim/killaura cheats
            if((rot.x % 5 == 0 || (rot.y % 5 == 0 && Math.abs(rot.y) != 90)) && rot.x != 0 && rot.y != 0) {
                // Flag the player
                flag(player, "Killaura", "A", "Combat", "rotation-y%1", 0, false);
            }
        }

        // This check is not from Matrix Anticheat
        if(!Number.isInteger(rot.x) && (Number.isInteger(rot.x) || Number.isInteger(rot.y))) {
            flag(player, "Killaura", "A", "Combat", "rotation", -90, false);
        }
    }
	
}