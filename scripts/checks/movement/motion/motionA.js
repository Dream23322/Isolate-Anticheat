import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

export function motion_a(player) {
    const playerSpeed = getSpeed(player);
    if(config.modules.motionA.enabled) {
        if(playerSpeed > config.modules.badpacketsB.speed && playerSpeed < 1000) {
            if(player.hasTag("ground")) {
                flag(player, "Motion", "A", "Movement", "speed", playerSpeed, true);
                player.addTag("strict");
            }
        }
    }  
}