import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getAverage, getKurtosis, getSkewness } from "../../../utils/mathUtil.js";
const buffer = new Map();
const data = new Map();
export function autoclicker_e(player) {
    if(config.modules.autoclickerE.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerE.checkCPSAfter) {

        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        const d = data.get(player.name) ?? {};
        if(d) {
            
            const CPSList = [player.cps, d.one, d.two, d.three, d.four, d.five, d.six, d.seven, d.eight, d.nine, d.ten]
            const avg = getAverage(CPSList);
            if(avg > config.modules.autoclickerE.minCPS) {            
                const skewness = Math.abs(getSkewness(CPSList));
            
                if(skewness < 0.15 && getKurtosis(CPSList) < 0) {
                    buffer.set(player.name, (buffer.get(player.name) || 0) + 1);
                    if(buffer.get(player.name) > config.modules.autoclickerE.buffer) {
                        flag(player, "Autoclicker", "E", "Combat", "kurtosis", getKurtosis(CPSList));
                        buffer.set(player.name, 0);
                    }
                }
            }
        }

        // Save last 10 CPS values 
        data.set(player.name, {
            one: player.cps,
            two: d.one || 0,
            three: d.two || 0,
            four: d.three || 0,
            five: d.four || 0,
            six: d.five || 0,
            seven: d.six || 0,
            eight: d.seven || 0,
            nine: d.eight || 0,
            ten: d.nine || 0
        });
    }
}