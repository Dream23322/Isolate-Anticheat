import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { hVelocity } from "../../../utils/mathUtil.js";

export function predictMovement(player, lastVelocities) {
    const { isJumping, hasTag, isFlying, getVelocity, getEffect, tags } = player;
    const { enabled } = config.modules.predictionA;
    const { x: lastX, z: lastZ } = lastVelocities.get(player) || { x: 0, z: 0 };
    const { x: curX, z: curZ } = getVelocity();
    const hasSpeedEffect = getEffect("speed");
    const isPlacing = tags.has("placing");

    if (enabled && !isJumping && !hasTag("nostrafe") && !hasTag("damaged") && !isFlying && !hasTag("op")) {
        const xDiff = Math.abs(lastX - curX);
        const zDiff = Math.abs(lastZ - curZ);

        if (hVelocity(player) > 1 && (xDiff > 0.1 || zDiff > 0.1) && !hasSpeedEffect && !isPlacing) {
            flag(player, "Prediction", "A", "Movement", "x_diff", `${xDiff}, z_diff=${zDiff}`);
        }

        lastVelocities.set(player, { x: curX, z: curZ });
    }
}
