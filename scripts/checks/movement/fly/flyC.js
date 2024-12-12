import { getScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil.js";
import { abs } from "../../../utils/maths/fastMath.js";
import { mathOnGround } from "../../../utils/maths/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";
const data = new Map();
const data2 = new Map();
export function fly_c(player) {
    if(!allowedPlatform(player, config.modules.flyC.AP)) return;
    // Checks for Ground Spoof (BETA)
    if(config.modules.flyC.enabled && getScore(player, "tick_counter2", 0) > 8 && data2.get(player.name) && !player.hasTag("teleport")) {
        if(aroundAir(player) && !player.hasTag("elytra") && !player.isGliding && !player.hasTag("trident")) {
            const posDiff = isomath.abs(player.location.x - data2.get(player.name).x) + isomath.abs(player.location.z - data2.get(player.name).z);
            if((player.hasTag("ground") || player.isOnGround || mathOnGround(player.location.y)) && posDiff < 8 && posDiff !== 0 && !player.isJumping && !player.hasTag("damaged") && !player.hasTag("placing") && !player.isFlying) {
                flag(player, "Fly", "C", "Spoof (BETA)", "onGround", "invalid" + `${mathOnGround(player.location.y)}`, false);
            }
        }
    }
    data2.set(player.name, {x: player.location.x, y: player.location.y, z: player.location.z})
}