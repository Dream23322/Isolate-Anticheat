import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs, fastRound } from "../../../utils/fastMath.js";

const data = new Map();

export function aim_h(player) {
    if(!allowedPlatform(player, config.modules.aimH.AP)) return;
    if(config.modules.aimH.enabled) {

        const rot = player.getRotation();
        if(data.get(player.name)) {
            const deltaYaw = fastAbs(rot.y - data.get(player.name).y);
            const deltaPitch = fastAbs(rot.x - data.get(player.name).x);
            if(deltaYaw < 5) return;
            const lastDeltaYaw = fastAbs(data.get(player.name).y - data.get(player.name).y2);

            if(lastDeltaYaw > 5 && deltaYaw > 5) {
                const roundedYaw = fastRound(deltaYaw);
                const previousRoundedYaw = fastRound(lastDeltaYaw);

                const yawDeltaChange = fastAbs(deltaYaw - lastDeltaYaw);

                if (roundedYaw == previousRoundedYaw
                    && deltaYaw > 0.01
                    && yawDeltaChange > 0.001
                    && yawDeltaChange < 0.1
                    && deltaPitch > 0.5
                    && deltaPitch <= 20
                    && (player.hasTag("attacking") || !config.modules.aimH.needHit)
                ) {
                    flag(player, "Aim", "H", "Kuristosis (Beta)", "yawDeltaChange", yawDeltaChange, true);
                }
            }
        }
        data.set(player.name, {
            x: rot.x,
            y: rot.y,
            x2: data.get(player.name)?.x || 0,
            y2: data.get(player.name)?.y || 0
        });
    }
}