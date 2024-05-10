import * as Minecraft from "@minecraft/server";
import { flag, getScore } from "../../../util";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil";

const data = new Map();
export function fly_d(player) {
    // TODO make this a NON BDS prediction based fly check for that one "realm" that doesnt use prediction
    if(config.modules.flyD.enabled) {
        if(
            !player.hasTag("isFlying") && 
            !player.isFlying && 
            !player.isOnGround && 
            !player.isJumping &&
            getScore(player, "airTime", 0) > 10 &&
            aroundAir(player) &&
            player.fallDistance < config.modules.flyD.dist &&
            !player.getEffect("jump_boost") &&
            !player.getEffect("levitation") &&
            !player.getEffect("slow_falling") &&
            getScore(player, "tick_counter2", 0) > 8 &&
            !player.hasTag("damaged")
        ) {
            flag(player, "Fly", "D", "Movement", "fallDistance", player.fallDistance, true);
        }
            
    }
}