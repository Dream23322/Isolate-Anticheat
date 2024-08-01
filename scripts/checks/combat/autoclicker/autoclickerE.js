import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getKurtosis, getSkewness } from "../../../utils/mathUtil.js";
import { playerTellraw } from "../../../utils/gameUtil.js";
const buffer = new Map();
const data = new Map();
export function autoclicker_e(player) {
    if(config.modules.autoclickerE.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerE.checkCPSAfter) {

        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        const d = data.get(player.name) ?? (new Array(10)).fill(0);
        if(d) {
            const CPSList = [player.cps, d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9]]
            // Get average CPS of the list:     
            const skewness = Math.abs(getSkewness(CPSList));
            if(skewness < 0.15 && getKurtosis(CPSList) < 0) {
                buffer.set(player.name, (buffer.get(player.name) || 0) + 1);
                if(buffer.get(player.name) > config.modules.autoclickerE.buffer) {
                    flag(player, "Autoclicker", "E", "Combat", "kurtosis", getKurtosis(CPSList));
                    buffer.set(player.name, 0);
                }
            }
            d.unshift(player.cps);
            d.pop();
            
        }
        // Save last 10 CPS values 
        data.set(player.name, d);
    }
}