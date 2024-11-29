import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/maths/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function motion_a(player) {
    if(!allowedPlatform(player, config.modules.motionA.AP)) return;
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