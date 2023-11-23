import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function motion_d(player) {
    if(config.modules.motionD.enabled) {
        if(player.fallDistance === 0 && player.hasTag("jumping") && player.isJumping) {
            flag(player, "Motion", "D", "Movement", "fallDistance", player.fallDistance, false);
        }
    }
}