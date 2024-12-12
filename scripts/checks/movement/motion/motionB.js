import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { abs } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";
export function motion_b(player) {
    if(!allowedPlatform(player, config.modules.motionB.AP)) return;
    const yVelocity = player.getVelocity().y;
    if(config.modules.motionB.enabled && isomath.abs(yVelocity) > 40 && !player.hasTag("trident") && !player.hasTag("elytra")) {
        flag(player, "Motion", "B", "Movement", "yVelocity", yVelocity, true);
    }
}