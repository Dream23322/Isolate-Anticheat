import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function scaffold_d(player, block, lastPlacePitch) {
    const rotation = player.getRotation();
    if(config.modules.scaffoldD.enabled) {

        // if(lastPlacePitch.get(player)) {
        //     let pitch_diff = Math.abs(lastPlacePitch.get(player).a - rotation.x);
        //     const yaw_diff = Math.abs(lastPlacePitch.get(player).b - rotation.y);
        //     const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.y - player.location.y, 2) + Math.pow(block.location.z - player.location.z, 2));
        //     if(rotation.x > 86 && rotation.x < 87 || rotation.x > 45 && rotation.x < 46 || rotation.x > 77 && rotation.x < 78 || rotation.x > 84 && rotation.x < 85) {
        //         if(pitch_diff > 0.11 && pitch_diff < 0.5 && yaw_diff !== 0.5) {
        //             flag(player, "Scaffold", "D", "World", "pitch_diff", pitch_diff, false);
        //         }
        //     }
        //     if(rotation.x > 83.04 && rotation.x < 84 && yaw_diff !== 0.5) {
        //         if(pitch_diff > 0.011 && pitch_diff < 0.5) {
        //             flag(player, "Scaffold", "D", "World", "pitch_diff", pitch_diff, false);
        //         }
        //     }
        // }
        // lastPlacePitch.set(player, {a:rotation.x, b: rotation.y});
        // // If the blocks location is below -64 flag
        // if(block.location.y < -64) {
        //     flag(player, "Scaffold", "D", "World", "location", block.location.y, false);
        // }


        // Check somewhat from Matrix Anticheat - Developed by jasonlaubb
        const playerVelocity = player.getVelocity();
        const rot = player.getRotation();
        // Stop false flags
        if(!player.isGliding && Math.hypot(playerVelocity.x, playerVelocity.z) > 0.2) {
            // Check rotation for aim/killaura cheats
            if((rotation.x % 1 == 0 || (rotation.y % 1 == 0 && Math.abs(rotation.y) != 90)) && rotation.x != 0 && rotation.y != 0) {
                // Flag the player
                flag(player, "Scaffold", "D", "Placement", "rotation-y%5", 0, false);
            }
        }
    }
}