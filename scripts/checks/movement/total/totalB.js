import { flag, getScore } from "../../../util";
import config from "../../../data/config.js";

const data = new Map();
export function total_b(player) {
    if(!allowedPlatform(player, config.modules.totalB.AP)) return;
    if(config.modules.totalB.enabled) {
        const lastTotal = data.get(player.name) ?? 0;

        let total = 0;

        total += getScore(player, "strafevl", 0);
        total += getScore(player, "speedvl", 0);
        total += getScore(player, "flyvl", 0);
        total += getScore(player, "motionvl", 0);
        total += getScore(player, "noslowvl", 0);

        const diff = total - lastTotal;

        if(diff > config.modules.totalB.max) {
            flag(player, "Total", "B", "Movement", "total", total, true);
        }

        data.set(player.name, total);
    }
}