import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed, getBlocksBetween } from "../../../utils/mathUtil.js";
import { fastAbs } from "../../../utils/fastMath.js";

export function noslow_b(player) {
    const playerSpeed = getSpeed(player);
    const playerVelocity = player.getVelocity();
    // NoSlow/B = Checks for speeding while in webs
    if(config.modules.noslowB.enabled && !player.hasTag("no-noslow") && playerSpeed !== 0 && player.isOnGround && player.fallDistance === 0 && !player.hasTag("spec") && playerSpeed > 0.5) {
        const pos1 = {x: player.location.x , y: player.location.y, z: player.location.z};
        const isInWeb = !getBlocksBetween(pos1, pos1).some((block) => player.dimension.getBlock(block)?.typeId !== "minecraft:web");
        if(player.hasTag("moving") && isInWeb && fastAbs(playerVelocity.y) < 0.1 && !player.getEffect("speed")) {
            flag(player, "NoSlow", "B", "Movement", "speed", playerSpeed, true);
        }
    }
}