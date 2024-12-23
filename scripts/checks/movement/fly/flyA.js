import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil.js";
import { getScore } from "../../../util";
import { allowedPlatform } from "../../../utils/platformUtils.js";

/*
Fly/A
Flight Check - Checks for fly cheats

This check works by looking for a player having a high y velocity, this works beacuse in the game, 99% of fly cheats are corrected by the game (BDS Prediction), this causes the player to basically jump up and down really fast, causing you to have a high velocity.
*/
export function fly_a(player) {
    if(!allowedPlatform(player, config.modules.flyA.AP)) return;
    const playerVelocity = player.getVelocity();
    if(config.modules.flyA.enabled && aroundAir(player) && !player.isOnGround && !player.hasTag("op") && !player.isGliding && !player.getEffect("levitation")) {
        // Stop bypasses and false flags for Pos Velocity
        //if(getScore(player, "airTime") < 10) return;
        let max_v_up = 0.62;
        if(player.isJumping) max_v_up = 0.8;
        if(player.getEffect("jump_boost")) max_v_up + player.getEffect("jump_boost").amplifier * 1.5 + 0.1;
        if(player.hasTag("placing")) max_v_up += 7;
        if(player.hasTag("damaged")) max_v_up += 6;
        if(player.hasTag("elytra")) max_v_up += 20;
        if(getScore(player, "tick_counter2", 0) < 8) return;
        if(player.fallDistance > 25) return;
        if(playerVelocity.y > max_v_up) flag(player, "Fly", "A", "Movement", "y-velocity", `${playerVelocity.y.toFixed(2)},damaged=${player.hasTag("damaged")},maxup=${max_v_up}`, true);
        
        // Stop false flags for Negative Velocity
        let min_v_down = -5.2 - player.fallDistance;
        if(player.hasTag("elytra")) min_v_down = -20;
        if(player.hasTag("damaged")) min_v_down = -4;
        if(player.hasTag("placing")) min_v_down = -7;
        if(playerVelocity.y < min_v_down) flag(player, "Fly", "A", "Movement", "y-velocity", `${playerVelocity.y.toFixed(2)},damaged=${player.hasTag("damaged")},mindown=${min_v_down}`, true);
    }
}