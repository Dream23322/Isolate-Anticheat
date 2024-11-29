import * as Minecraft from "@minecraft/server";
import { getScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const data = new Map();
export function fly_d(player) {
    if(!allowedPlatform(player, config.modules.flyD.AP)) return;
    if(config.modules.flyD.enabled && !player.hasTag("teleport")) {
        if(
            !player.hasTag("isFlying") && !player.isFlying && !player.isOnGround && !player.isJumping &&
            (getScore(player, "airTime", 0) > 10 && !player.hasTag("damaged")  &&
            player.fallDistance < config.modules.flyD.dist 
            || getScore(player, "airTime", 0) > 30 && player.fallDistance < 0.02) &&
            aroundAir(player)&&
            !player.getEffect("jump_boost") &&
            !player.getEffect("levitation") &&
            !player.getEffect("slow_falling") &&
            getScore(player, "tick_counter2", 0) > 8 &&
            !player.hasTag("elytra") &&
            !player.hasTag("placing") &&
            !player.hasTag("trident")
        ) {
            flag(player, "Fly", "D", "Movement", "fallDistance", player.fallDistance.toFixed(4), true);
        }
            
    }
}