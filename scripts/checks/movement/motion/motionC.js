import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { hVelocity } from "../../../utils/mathUtil.js";

export function motion_c(player, lastXZv) {
    const playerVelocity = player.getVelocity();
    if(config.modules.motionC.enabled && !player.isJumping && !player.hasTag("nostrafe") && !player.hasTag("damaged") && !player.isFlying && !player.hasTag("op") && !player.hasTag("teleport")) {
        if(lastXZv.get(player)) {
            const x_diff = Math.abs(lastXZv.get(player).x - playerVelocity.x);
            const z_diff = Math.abs(lastXZv.get(player).z - playerVelocity.z);
            if(hVelocity(player) > 1 && (x_diff > 0.1 || z_diff > 0.1) && !player.getEffect("speed") && !player.hasTag("placing") && !player.hasTag("jump")) {
                flag(player, "Motion", "C", "Movement", "x_diff", `${x_diff}, z_diff=${z_diff}`, true);
            }
        }
        lastXZv.set(player, {x: playerVelocity.x, z: playerVelocity.z});
    }
}