import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil.js";

/*
Fly/C 
Flight Check - Checks for fly cheats

Fly/C checks for falling up more than 1 block, which can detect fly motion
False Flag Chance: Jumping can cause false flags SOMETIMES
Effectiveness: High
*/

export function fly_c(player) {
    const playerVelocity = player.getVelocity();
    if(config.modules.flyC.enabled && player.fallDistance < config.modules.flyC.fallDistance && !player.hasTag("trident") && !player.hasTag("ground") && !player.hasTag("nofly") &&  (!player.hasTag("damaged") || !player.hasTag("fall_damage")) && player.hasTag("strict") && !player.hasTag("slime")) {
        // Stopping false flags
        if(!player.isJumping && !player.isGliding && !player.isFlying && !player.hasTag("jump") && !player.hasTag("op")) {
            
            if(aroundAir(player) === true && Math.abs(playerVelocity.y) > 0.1 && !player.hasTag("elytra")) {
                flag(player, "Fly", "C", "Movement", "fallDistance", player.fallDistance, false);
            }	
        }
    }	
}