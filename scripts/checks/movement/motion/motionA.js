import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

export function motion_a(player) {
    const playerSpeed = getSpeed(player);
    if(config.modules.motionA.enabled) {
        if(playerSpeed > config.modules.badpacketsB.speed && playerSpeed < 1000) {
            if(player.getEffect("speed")) {
                if(player.getEffect("speed").amplifier > 5) return;
            }
            if(player.hasTag("ground") && !player.hasTag("trident") && !player.hasTag("elytra")) {
                flag(player, "Motion", "A", "Movement", "speed", playerSpeed, true);
                player.addTag("strict");
            }
        }
    }  
}