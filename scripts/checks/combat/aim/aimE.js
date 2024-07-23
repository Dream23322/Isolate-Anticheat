import { flag } from "../../../util";
import config from "../../../data/config.js";
const data = new Map();

export function aim_e(player) {
    if(config.modules.aimE.enabled) {
        if(data.get(player.name)) { 
            const lastYaws = [data.get(player.name).one, data.get(player.name).two, data.get(player.name).three];
            const currentYaw = player.getRotation().x;
            const middleYawIndex = Math.floor(lastYaws.length / 2);
            const middleYaw = lastYaws[middleYawIndex];
            const [firstYaw, secondYaw] = lastYaws.slice(middleYawIndex - 1, middleYawIndex + 2);
            const diff1 = Math.abs(firstYaw - middleYaw);
            const diff2 = Math.abs(secondYaw - middleYaw);
            if(diff1 < 15 && diff2 < 15) {
                flag(player, "Killaura", "E", "Combat", "yawDiff", `${diff1} - ${diff2}`, false);
            }
        }
        data.set(player.name, {
            one: currentYaw,
            two: data.get(player.name)?.one || 0,
            three: data.get(player.name)?.two || 0
        })
    }
}
