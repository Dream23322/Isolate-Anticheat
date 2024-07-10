import { flag } from "../../../util";
import config from "../../../data/config";
const data = new Map();
export function motion_d(player) {
    if(config.modules.motionD.enabled && !player.hasTag("teleport")) {
        if(data.get(player.name)) {
            const currentY = player.getVelocity().y;
            const dY1 = data.get(player.name)?.one;
            const dY2 = data.get(player.name)?.two;
            const dY3 = data.get(player.name)?.three;
            if(currentY !== 0 && dY1 !== 0 && dY2 !== 0 && dY3 !== 0) {
                const diff1 = Math.abs(currentY - dY1);
                const diff2 = Math.abs(currentY - dY2);
                const invalid = (
                    currentY < dY1 &&
                    dY2 < dY1 &&
                    diff1 > 0.1 &&
                    diff2 < 0.08
                )
                const allow = !player.hasTag("elytra") && !player.hasTag("trident") && !player.isJumping && !player.hasTag("gliding") && !player.isGliding && !player.hasTag("jumping") && !player.hasTag("placing") && !player.hasTag("slime") && !player.hasTag("damaged")
                if((invalid) && allow) {
                    flag(player, "Motion", "D", "Movement", "y-Velocity", currentY, true);
                }


            }
        }
    }
    data.set(player.name, {
        one: player.getVelocity().y,
        two: data.get(player.name)?.one || 0,
        three: data.get(player.name)?.two || 0
    });
}

