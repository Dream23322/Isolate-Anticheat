import { flag } from "../../../util";
import config from "../../../data/config.js";
const data = new Map();
export function killaura_d(player) {
    if(config.modules.killauraD.enabled && player.hasTag("attacking")) {
        const rot = player.getRotation();
        if(data.get(player.name)) {
            const dat = data.get(player.name);
            if(data.get(player.name).two !== null) {
                const deltaXZ = Math.hypot(Math.abs(rot.x - dat.one.x), Math.abs(rot.z - dat.two.z));
                const lastDeltaXZ = Math.hypot(Math.abs(dat.one.x - dat.two.x), Math.abs(dat.one.z - dat.two.z));
                const accelXz = Math.abs(deltaXZ - lastDeltaXZ);

                const deltaYaw = Math.abs(rot.y - dat.one.y);

                if(deltaYaw > 35 && accelXz < 0.00001) {
                    flag(player, "Killaura", "D", "Combat (BETA)", "RotData", `${deltaXZ},${accelXz}`, false);
                }

            }
        }
        data.set(player.name, {
            one: rot,
            two: data.get(player.name)?.one || null
        });

    }
}