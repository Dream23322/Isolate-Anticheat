import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed, getBlocksBetween } from "../../../utils/mathUtil.js";

export function prediction_a(player, fastStopLog) {
    const playerSpeed = getSpeed(player);
    const playerVelocity = player.getVelocity();
    // Prediction/A = Checks for fast stop
    if(config.modules.predictionA.enabled && !player.hasTag("noprediction")) {
        if(playerSpeed === 0) {
            const lastSpeed = fastStopLog.get(player) || 0;
            const currentSpeed = getSpeed(player);

            // This checks for hovering with Fly or Using glide
            const prediction1 = playerVelocity.y === -0.02566051483154297;
            if(currentSpeed === 0 && lastSpeed > 0.22) {
                const pos1 = {x: player.location.x - 2, y: player.location.y, z: player.location.z - 2};
                const pos2 = {x: player.location.x + 2, y: player.location.y + 2, z: player.location.z + 2};

                const isInAir = !getBlocksBetween(pos1, pos2).some((block) => player.dimension.getBlock(block)?.typeId !== "minecraft:air");
                if(isInAir && playerSpeed === 0) {
                    if(!player.isJumping && !player.hasTag("moving")) {
                        flag(player, "Prediction", "A", "Movement", "lastSpeed", lastSpeed, false);
                    }
                }
            }

            // Simple glide check (-0.01)
            if(prediction1) {
                flag(player, "Prediction", "A", "Movement", "yVelocity", playerVelocity.y, false);
            }
        }
    }
}