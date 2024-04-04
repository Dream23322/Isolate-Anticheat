import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil.js";
import { getScore } from "../../../util";

/*
Fly/A
Flight Check - Checks for fly cheats

This check works by looking for a player having a high y velocity, this works beacuse in the game, 99% of fly cheats are corrected by the game, this causes the player to basically jump up and down really fast, causing you to have a high velocity.
*/
export function fly_a(player) {
    // Fly/A = Velocity Check
    const playerVelocity = player.getVelocity();
    if(config.modules.flyA.enabled && !player.hasTag("elytra")) {
        if(aroundAir(player) === true && !player.getEffect("jump_boost") || !player.isOnGround && Math.abs(playerVelocity.y) > 3 && player.getEffect("jump_boost")) {


            let max_v_up = 0.62;
            if(player.isJumping) {
                max_v_up = 0.8;
            }
            if(!player.hasTag("nofly") && !player.hasTag("nofly") && (!player.hasTag("damaged") && !player.hasTag("fall_damage")) && !player.isGliding) {
                //const simYPos = Math.abs(currentYPos - oldY) <= config.modules.flyF.diff && Math.abs(currentYPos - oldOldY) <= config.modules.flyF.diff;
                
                const prediction = (playerVelocity.y > max_v_up && aroundAir(player) === true && playerVelocity.y !== 1 || playerVelocity.y < -4.92 - player.fallDistance && aroundAir(player) === true) && playerVelocity.y !== -1 && playerVelocity.y > -9
                
                if(prediction && getScore(player, "tick_counter2", 0) > 8 && player.fallDistance < 25 && !player.hasTag("placing")) {
                    flag(player, "Fly", "A", "Movement", "y-velocity", playerVelocity.y, false);
                }
            }

        }
    }
}