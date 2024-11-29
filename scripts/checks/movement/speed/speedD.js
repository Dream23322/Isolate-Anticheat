import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config";
import { hVelocity } from "../../../utils/maths/mathUtil.js";
import { fastAbs } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const data = new Map();
export function speed_d(player) {
    if(!allowedPlatform(player, config.modules.speedD.AP)) return;
    if(config.modules.speedD.enabled) {
        if(data.get(player.name)) {
            const currentY = fastAbs(player.getVelocity().y);
            const dY1 = fastAbs(data.get(player.name)?.one);
            const dY2 = fastAbs(data.get(player.name)?.two);
            const dY3 = fastAbs(data.get(player.name)?.three);
            if(currentY !== 0 && dY1 !== 0 && dY2 !== 0 && dY3 !== 0) {
                const invalid = (
                    currentY < 0.1 &&
                    dY1 > 0.15 &&
                    dY2 < 0.1
                )
                const invalid2 = (
                    currentY < 0.1 &&
                    dY1 > 0.15 &&   
                    dY2 > 0.15 &&
                    dY3 < 0.1
                )
                const allow = !player.hasTag("elytra") && !player.hasTag("trident") && !player.isJumping && !player.hasTag("gliding") && !player.isGliding && !player.hasTag("jumping") && hVelocity(player) > 0.28 && !player.hasTag("placing") && !player.hasTag("slime") && !player.hasTag("damaged") && !player.hasTag("teleport") && !player.hasTag("gmc")
                if((invalid || invalid2) && allow) flag(player, "Speed", "D", "Movement", "y-Velocity", currentY.toFixed(2), true);
            }
        }
    }
    data.set(player.name, {
        one: player.getVelocity().y,
        two: data.get(player.name)?.one || 0,
        three: data.get(player.name)?.two || 0
    });
}

