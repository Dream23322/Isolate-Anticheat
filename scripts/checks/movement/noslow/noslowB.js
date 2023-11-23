import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";
import { getBlocksBetween } from "../../../utils/mathUtil.js";

export function noslow_a(player) {
    const playerSpeed = getSpeed(player);
    const playerVelocity = player.getVelocity();
    // NoSlow/B = Checks for speeding while in webs
    if(config.modules.noslowB.enabled && !player.hasTag("no-noslow") && playerSpeed !== 0 && player.isOnGround && player.fallDistance === 0 && !player.hasTag("spec") && playerSpeed > 0.5) {
        const pos1 = {x: player.location.x , y: player.location.y, z: player.location.z};
        const isInWeb = !getBlocksBetween(pos1, pos1).some((block) => player.dimension.getBlock(block)?.typeId !== "minecraft:web");
        if(player.hasTag("moving") && isInWeb && Math.abs(playerVelocity.y) < 0.1 && !player.getEffect("speed")) {
            flag(player, "NoSlow", "B", "Movement", "speed", playerSpeed, true);
        }
    }
}