import { flag, getScore } from "../../../util";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const data = new Map();
export function total_c(player) {
    if(!allowedPlatform(player, config.modules.totalC.AP)) return;
    if(config.modules.totalC.enabled) {
        const lastTotal = data.get(player.name) ?? 0;

        let total = 0;

        total += getScore(player, "timervl", 0);
        total += getScore(player, "badpacketsvl", 0);
        total += getScore(player, "exploitvl", 0);

        const diff = total - lastTotal;

        if(diff > config.modules.totalC.max) {
            flag(player, "Total", "C", "Packet", "total", total, true);
        }

        data.set(player.name, total);
    }
}