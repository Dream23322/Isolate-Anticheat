import { flag } from "../../../util";
import config from "../../../data/config.js";
const data = new Map();
export function autoclicker_c(player) {
    if(config.modules.autoclickerC.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerC.checkCPSAfter) {
        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        const cps = player.cps;
        const isRounded = Math.round(cps) === cps;
        if(isRounded) {
            if(data.get(player.name)) {
                const buffer = data.get(player.name)
                if(buffer > config.modules.autoclickerC.buffer) {
                    flag(player, "Autoclicker", "C", "Combat", "CPS-Diff", diff);
                    data.set(player.name, -1);
                }
            }
            data.set(player.name, (data.get(player.name) || 0) + 1);
        }
    }

}