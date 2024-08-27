import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getAverageDifference, isWavePattern } from "../../../utils/mathUtil.js";
const data = new Map();
const datatwo = new Map();
export function killaura_d(player) {
    if(config.modules.killauraD.enabled) {
        const rot = player.getRotation();
        const pitch = rot.x;
        const yaw = rot.y;

        const d = data.get(player.name) ?? (new Array(10)).fill(0);
        const dtwo = datatwo.get(player.name) ?? (new Array(10)).fill(0);
        if(d && dtwo) {
            const asList = [d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9]];
            const asList2 = [dtwo[0], dtwo[1], dtwo[2], dtwo[3], dtwo[4], dtwo[5], dtwo[6], dtwo[7], dtwo[8], dtwo[9]];
            if(
                Math.abs(getAverageDifference(asList2)) > 2 && 
                isWavePattern(asList) && 
                Math.abs(getAverageDifference(asList)) > 17
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