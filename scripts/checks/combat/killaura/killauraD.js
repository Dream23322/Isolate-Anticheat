import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { arrayToList, getAverageDifference, isWavePattern } from "../../../utils/maths/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";
const data = new Map();
const datatwo = new Map();
export function killaura_d(player) {
    if(!allowedPlatform(player, config.modules.killauraD.AP)) return;
    if(config.modules.killauraD.enabled) {
        const rot = player.getRotation();
        const pitch = rot.x;
        const yaw = rot.y;

        const d = data.get(player.name) ?? (new Array(10)).fill(0);
        const dtwo = datatwo.get(player.name) ?? (new Array(10)).fill(0);
        if(d && dtwo) {
            const asList = arrayToList(d);
            const asList2 = arrayToList(dtwo);
            if(
                isomath.abs(getAverageDifference(asList2)) > 2 && 
                isWavePattern(asList) && 
                isomath.abs(getAverageDifference(asList)) > 17
            ) {
                flag(player, "Killaura", "D", "Combat (Beta)", "data", `${getAverageDifference(asList)}, ${getAverageDifference(asList2)}`, true);
            }
            d.unshift(yaw);
            dtwo.unshift(pitch);
            if(d.length > 10) d.pop();
            if(dtwo.length > 10) dtwo.pop();
        }

        data.set(player.name, d);
        datatwo.set(player.name, dtwo);

    }
}