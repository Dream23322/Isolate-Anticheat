import { flag } from "../../../util";
import config from "../../../data/config.js";
const data = new Map();
export function autoclicker_d(player) {
    if(config.modules.autoclickerD.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerD.checkCPSAfter) {
        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        if(data.get(player.name)) {
            const cpsDiff = Math.abs(data.get(player.name) - player.cps);
            const isRounded = Number.isInteger(cpsDiff);
            if(isRounded) {
                flag(player, "Autoclicker", "D", "Combat", "cpsDiff", cpsDiff);
            }
        }
        data.set(player.name, player.cps);
    }
}