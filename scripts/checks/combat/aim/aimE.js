import { debug, flag } from "../../../util";
import { getAverage, getStandardDeviation, gcd, EXPANDER } from "../../../utils/mathUtil";
import config from "../../../data/config.js";
const data = new Map();
export function aim_e(player) {
    if(config.modules.aimE.enabled) {
        if(data.get(player.name)) { 
            const deltaPitch = Math.abs(player.getRotation().x - data.get(player.name).one);
            const lastDeltaPitch = Math.abs(data.get(player.name).one - data.get(player.name).two);
            if(deltaPitch !== 0 && lastDeltaPitch !== 0) {
                const expandedDeltaPitch = (deltaPitch * EXPANDER);
                const expandedLastDeltaPitch = (lastDeltaPitch * EXPANDER);
                const gcd = gcd(expandedDeltaPitch, expandedLastDeltaPitch);
                debug(player, `GCD: ${gcd}, EXPAND1: ${expandedDeltaPitch}, EXPAND2: ${expandedLastDeltaPitch}`);
                if(gcd < 1311072) flag(player, "Aim", "E", "Combat (BETA)", "GCD", `${gcd}`, false);
            }
        }
        data.set(player.name, {
            one: player.getRotation().x,
            two: data.get(player.name)?.one || 0
        })
    }
}