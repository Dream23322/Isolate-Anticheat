import { flag, getScore } from "../../../util";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const data = new Map();
export function total_a(player) {
    if(!allowedPlatform(player, config.modules.totalA.AP)) return;
    if(config.modules.totalA.enabled) {
        const lastTotal = data.get(player.name) ?? 0;

        let total = 0;

        total += getScore(player, "aimvl", 0);
        total += getScore(player, "killauravl", 0);
        total += getScore(player, "autoclickervl", 0);
        total += getScore(player, "hitboxvl", 0);
        total += getScore(player, "reachvl", 0);

        const diff = total - lastTotal;

        if(diff > config.modules.totalA.max) {
            flag(player, "Total", "A", "Combat", "total", total, true);
        }

        data.set(player.name, total);
    }
}