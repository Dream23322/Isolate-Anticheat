import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { arrayToList } from "../../../utils/maths/mathUtil.js";
import { countTrue } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const data = new Map();
export function killaura_e(player) {
    return;
    if(!allowedPlatform(player, config.modules.killauraE.AP)) return;
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
