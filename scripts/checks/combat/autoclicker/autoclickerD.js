import { flag } from "../../../util";
import config from "../../../data/config.js";
const data = new Map();
export function autoclicker_d(player) {
    if(config.modules.autoclickerD.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerD.checkCPSAfter) {
        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        if(data.get(player.name)) {
            const dat = data.get(player.name);
            if(dat.one > 0 && dat.two > 0 && dat.three > 0 && player.cps > 0) {
                const isWave = (
                    Math.abs(player.cps - dat.two) < 1 &&
                    Math.abs(player.cps - dat.three) > 1.5 &&
                    Math.abs(data.one - dat.three) < 1
                )

                if(isWave) flag(player, "Autoclicker", "D", "Combat", "CPS", player.cps, false);
            }
        }
        data.set(player.name, {
            one: player.cps,
            two: data.get(player.name)?.one || 0,
            three: data.get(player.name)?.two || 0
        });
    }
}