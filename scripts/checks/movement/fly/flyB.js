import * as Minecraft from "@minecraft/server";
import { flag, getScore } from "../../../util";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil.js";
import { hVelocity } from "../../../utils/mathUtil.js";
/*
Fly/B 
Flight Check - Checks for fly cheats

Fly/B Checks for patterns in a players y velocity

*/
const fly_b_map = new Map();
export function fly_b(player) {
    if(config.modules.flyB.enabled && aroundAir(player)) {
        const velocityY = player.getVelocity().y;
        if(fly_b_map.has(player)) {
            if(fly_b_map.get(player) == 0 && velocityY == 0 && getScore(player, "tick_counter2", 0) > 3 && !player.isOnGround && hVelocity(player) !== 0 && getScore(player, "airTime") >= 30) {
                flag(player, "Fly", "B", "Movement", "Velocity", velocityY, false);
            }
        }
        fly_b_map.set(player, velocityY);
    }
}