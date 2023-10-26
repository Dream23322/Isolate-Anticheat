import * as Minecraft from "@minecraft/server";
import { getHealth, playerTellraw, setTitle, setParticle, setSound, inAir, aroundAir} from "./utils/gameUtil.js";
import { getBlocksBetween, getSpeed, angleCalc, hVelocity } from "./utils/mathUtil.js";
import { flag, banMessage, getClosestPlayer, getScore, setScore } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import config from "./data/config.js";

export function fly_a(player) {
    const playerVelocity = player.getVelocity();
    if(config.modules.flyA.enabled) {
        if(aroundAir(player) === true && !player.getEffect("jump_boost")) {
            let max_v_up = 0.42;
            if(player.isJumping) {
                max_v_up = 0.6;
            }
            if(!player.hasTag("nofly") && !player.hasTag("nofly") && (!player.hasTag("damaged") && !player.hasTag("fall_damage")) && !player.isGliding) {
                //const simYPos = Math.abs(currentYPos - oldY) <= config.modules.flyF.diff && Math.abs(currentYPos - oldOldY) <= config.modules.flyF.diff;
                
                const prediction = (playerVelocity.y > max_v_up && aroundAir(player) === true && playerVelocity.y !== 1 || playerVelocity.y < -3.92 && aroundAir(player) === true) && playerVelocity.y !== -1 && playerVelocity.y > -9
                if(prediction && getScore(player, "tick_counter2", 0) > 3 && player.fallDistance < 25 && !player.hasTag("placing") && player.getEffect("speed") && player.getEffect("speed").amplifier > 5) {
                    flag(player, "Fly", "A", "Movement", "y-velocity", playerVelocity.y, false);
                }
            }
        }
    }
}