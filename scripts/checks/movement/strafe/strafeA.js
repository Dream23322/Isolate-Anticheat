import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { hVelocity } from "../../../utils/mathUtil.js";

export function strafe_a(player, lastXZv) {
    const playerVelocity = player.getVelocity();
    if(config.modules.strafeA.enabled && !player.isJumping && !player.hasTag("nostrafe") && !player.hasTag("damaged") && !player.isFlying && !player.hasTag("op")) {
        if(lastXZv.get(player)) {
            // calculate velocity differences
            const x_diff = Math.abs(lastXZv.get(player).x - playerVelocity.x);
            const z_diff = Math.abs(lastXZv.get(player).z - playerVelocity.z);

            // If the player seems to be using any sort of strafe cheats, flag them for Strafe/A
            if(hVelocity(player) > 1 && (x_diff > 0.1 || z_diff > 0.1) && !player.getEffect("speed") && !player.hasTag("placing")) {
                flag(player, "Strafe", "A", "Movement", "x_diff", `${x_diff}, z_diff=${z_diff}`, true);
            }
        }
        // Set the new lastXZv to the current player velocity values.
        lastXZv.set(player, {x: playerVelocity.x, z: playerVelocity.z});
    }
}