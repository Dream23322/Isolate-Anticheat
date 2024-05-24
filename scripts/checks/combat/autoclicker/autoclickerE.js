import { flag } from "../../../util";
import config from "../../../data/config.js";
const data = new Map();
export function autoclicker_e(player) {
    if(config.modules.autoclickerE.enabled) {
        if(data.get(player.name)) {
            const current = Date.now();
            const mid = data.get(player.name).one;
            const last = data.get(player.name).two;
            if(last) {
                const delta = Math.abs(current - mid);
                const delta2 = Math.abs(mid - last);
                if(delta === delta2) flag(player, "Autoclicker", "E", "Combat (BETA)", "Delta", `${delta}`, false);
            }
        }
        data.set(player.name, {
            one: Date.now(),
            two: data.get(player.name)?.one
        });
    }
}