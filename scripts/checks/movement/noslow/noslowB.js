import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getSpeed, getBlocksBetween } from "../../../utils/maths/mathUtil.js";
import { fastAbs } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function noslow_b(player) {
    if(!allowedPlatform(player, config.modules.noslowB.AP)) return;
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