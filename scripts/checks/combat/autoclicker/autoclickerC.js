import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { abs, round } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { abs, round } from "../../../utils/maths/isomath.js";

const data = new Map();
export function autoclicker_c(player) {
    if(!allowedPlatform(player, config.modules.autoclickerC.AP)) return;
    if(config.modules.autoclickerC.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerC.checkCPSAfter) {
        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        const cps = player.cps;
        const isRounded = Number.isInteger(cps);
        if(config.modules.autoclickerC.experimental) {
            const difference = abs(round(cps) - cps);
            if(difference < 0.001) {
                if(data.get(player.name)) {
                    const buffer = data.get(player.name);
                    if(buffer > config.modules.autoclickerC.buffer && cps > 10) {
                        flag(player, "Autoclicker", "C", "Combat (BETA)", "cps", cps);
                        data.set(player.name, -1);
                    }
                }
                data.set(player.name, (data.get(player.name) || 0) + 1);
            }
        }
        if(isRounded) {
            if(data.get(player.name)) {
                const buffer = data.get(player.name)
                if(buffer > config.modules.autoclickerC.buffer && cps > 10) {
                    flag(player, "Autoclicker", "C", "Combat", "cps", cps);
                    data.set(player.name, -1);
                } 
            }
            data.set(player.name, (data.get(player.name) || 0) + 1);
        }
        
    }

}