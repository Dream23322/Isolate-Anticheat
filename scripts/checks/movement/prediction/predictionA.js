import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { hVelocity } from "../../../utils/mathUtil.js";

export function prediction_a(player, lastXZv) {
    const playerVelocity = player.getVelocity();
    if(config.modules.predictionA.enabled && !player.isJumping && !player.hasTag("nostrafe") && !player.hasTag("damaged") && !player.isFlying && !player.hasTag("op")) {
        if(lastXZv.get(player)) {
            const x_diff = Math.abs(lastXZv.get(player).x - playerVelocity.x);
            const z_diff = Math.abs(lastXZv.get(player).z - playerVelocity.z);
            if(hVelocity(player) > 1 && (x_diff > 0.1 || z_diff > 0.1) && !player.getEffect("speed") && !player.hasTag("placing")) {
                flag(player, "Prediction", "A", "Movement", "x_diff", `${x_diff}, z_diff=${z_diff}`, true);
            }
        }
        lastXZv.set(player, {x: playerVelocity.x, z: playerVelocity.z});
    }
}