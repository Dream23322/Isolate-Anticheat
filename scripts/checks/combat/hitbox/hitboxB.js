import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { angleCalc, getDistanceXYZ} from "../../../utils/maths/mathUtil.js";

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
        const d = data.get(player.name) ?? (new Array(9)).fill(0);
        if(d) {
            const current_angle = angleCalc(player, entity);
            const average_angle = fastAb((current_angle + d[0] + d[1] + d[2] + d[3] + d[4] + d[5] + d[6] + d[7] + d[8] + d[9]) / 10);
            if(
                average_angle > config.modules.hitboxB.max_avg_angle
            ) flag(player, "Hitbox", "B", "Combat", "AVG_ANGLE", `${average_angle.toFixed(5)},PLATFORM=${platformType},DISTANCE=${getDistanceXYZ(player, entity)}`, true);

            d.unshift(current_angle);
            d.pop();
        }
        data.set(player.name, d);
    }
}