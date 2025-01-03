import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { angleCalc } from "../../../utils/maths/mathUtil.js";
import * as isomath from "../../../utils/maths/isomath.js";

const data = new Map();
export function hitbox_b(player, entity) {
    const platformType = player.clientSystemInfo.platformType;
    if(
        config.modules.hitboxB.enabled &&
        (
            platformType === "Desktop" || 
            platformType === "Console"
        )
    ) {
        const dat = data.get(player.name) ?? (new Array(5).fill(0));
        if(dat) {
            const angle = angleCalc(player, entity);
            dat.unshift(angle);
            if(dat.length > 5) {
                dat.pop();
                const average_angle = isomath.getAverage(dat);
                if(average_angle > config.modules.hitboxB.angle) flag(player, "Hitbox", "B", "Combat", "avg_angle", average_angle, true);
            }
        }
        data.set(player.name, dat);
    }
}