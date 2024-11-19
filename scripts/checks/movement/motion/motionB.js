import { flag } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs } from "../../../utils/fastMath.js";

export function motion_b(player) {
    if(!allowedPlatform(player, config.modules.motionB.AP)) return;
    const yVelocity = player.getVelocity().y;
    if(config.modules.motionB.enabled && fastAbs(yVelocity) > 40 && !player.hasTag("trident") && !player.hasTag("elytra")) {
        flag(player, "Motion", "B", "Movement", "yVelocity", yVelocity, true);
    }
}