import { flag, setScore, getScore } from "../../../util";
import config from "../../../data/config.js";
import { getAverage, getKurtosis, getSkewness } from "../../../utils/mathUtil.js";
const buffer = new Map();
const data = new Map();
export function autoclicker_e(player) {
    if(config.modules.autoclickerE.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerE.checkCPSAfter) {

        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);

        if(data.get(player.name)) {
            const d = data.get(player.name);
            const CPSList = [player.cps, d.one, d.two, d.three, d.four, d.five, d.six, d.seven, d.eight, d.nine, d.ten]
            const avg = getAverage(CPSList);
            if(avg > config.modules.autoclickerE.minCPS) {            
                const skewness = Math.abs(getSkewness(CPSList));
            
                if(skewness < 0.15 && getKurtosis(CPSList) < 0) {
                    buffer.set(player.name, (buffer.get(player.name) || 0) + 1);
                    if(data.get(player.name) > config.modules.autoclickerE.buffer) {
                        flag(player, "Autoclicker", "E", "Combat", "kurtosis", getKurtosis(CPSList));
                        buffer.set(player.name, 0);
                    }
                }
            }
        }

        // Save last 10 CPS values (awwwwwww does ur ram hurt lelelelelel)
        data.set(player.name, {
            one: player.cps,
            two: data.get(player.name)?.one || 0,
            three: data.get(player.name)?.two || 0,
            four: data.get(player.name)?.three || 0,
            five: data.get(player.name)?.four || 0,
            six: data.get(player.name)?.five || 0,
            seven: data.get(player.name)?.six || 0,
            eight: data.get(player.name)?.seven || 0,
            nine: data.get(player.name)?.eight || 0,
            ten: data.get(player.name)?.nine || 0
        });
    }
}