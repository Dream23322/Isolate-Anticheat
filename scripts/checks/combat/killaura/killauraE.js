import { flag } from "../../../util";
import config from "../../../data/config.js";
import { arrayToList } from "../../../utils/mathUtil.js";
import { countTrue } from "../../../utils/fastMath.js";
const data = new Map();
export function killaura_e(player) {
    if (!config.modules.killauraE.enabled) return;

    const sprint = player.isSprinting;

    const d = data.get(player.name) ?? (new Array(10)).fill(0);

    if(d) {

        const sprintList = arrayToList(d);

        const sprintAmt = countTrue(sprintList);

        if(sprintAmt >= config.modules.killauraE.minSprint) {
            flag(player, "Killaura", "E", "Combat", "sprint", sprintAmt, true);
        }

        d.unshift(sprint);

        if(d.length > 10) d.pop();
    }

    data.set(player.name, d);
    
}
