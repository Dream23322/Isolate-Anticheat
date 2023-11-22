import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { hVelocity, getSpeed } from "../../../utils/mathUtil.js";

export function speed_c(player) {
    const playerSpeed = player.getSpeed();
    if(config.modules.speedC.enabled) {
        if(player.hasTag("ground") && player.isOnGround && !player.getEffect("speed") && playerSpeed > config.modules.speedC.speed) {
            flag(player, "Speed", "C", "Movement", "groundspeed", playerSpeed);
        }
    }
}