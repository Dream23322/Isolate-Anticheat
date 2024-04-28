import * as Minecraft from "@minecraft/server";
import { flag, getScore } from "../../../util";
import config from "../../../data/config.js";
import { aroundAir, inAir } from "../../../utils/gameUtil.js";
import { getSpeed } from "../../../utils/mathUtil.js";
const data = new Map();
const data2 = new Map();
export function fly_c(player) {
    // Checks for Ground Spoof (BETA)
    if(config.modules.flyC.enabled && getScore(player, "tick_counter2", 0) > 8 && data2.get(player.name)) {
        if(aroundAir(player) && !player.hasTag("elytra") && !player.isGliding) {
            const posDiff = Math.abs(player.location.x - data2.get(player.name).x) + Math.abs(player.location.z - data2.get(player.name).z);
            if((player.hasTag("ground") || player.isOnGround) && posDiff < 8 && posDiff !== 0) {
                flag(player, "Fly", "C", "Spoof", "onGround", "invalid", false);
            }
        }
    }
    data2.set(player.name, {x: player.location.x, y: player.location.y, z: player.location.z})
}