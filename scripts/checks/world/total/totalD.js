import { flag, getScore } from "../../../util";
import config from "../../../data/config.js";

const data = new Map();
export function total_d(player) {
    if(!allowedPlatform(player, config.modules.totalD.AP)) return;
    if(config.modules.totalD.enabled) {
        const lastTotal = data.get(player.name) ?? 0;

        let total = 0;

        total += getScore(player, "scaffoldvl", 0);
        total += getScore(player, "nukervl", 0);
        total += getScore(player, "reachvl", 0);

        const diff = total - lastTotal;

        if(diff > config.modules.totalD.max) {
            flag(player, "Total", "D", "Movement", "total", total, true);
        }

        data.set(player.name, total);
    }
}