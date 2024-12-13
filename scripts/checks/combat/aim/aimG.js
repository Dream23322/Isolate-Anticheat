import { getScore, setScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { arrayToList, getAverage, getgcd, getGcdFloat, getOutliersInt, getStandardDeviationV2 } from "../../../utils/maths/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { abs } from "../../../utils/maths/isomath.js";

const dataYaw = new Map();
const dataPitch = new Map();

export function aim_g(player) {
    if(!allowedPlatform(player, config.modules.aimG.AP)) return;
    if(config.modules.aimG.enabled) {
        const rot = player.getRotation();

        const lastDat = dataYaw.get(player.name) ?? 0;
        const dP = dataPitch.get(player.name) ?? (new Array(20)).fill(0);

        if(lastDat !== 0 && dP) {
            const deltaYaw = abs(rot.y - lastDat.y);
            const deltaPitch = abs(rot.x - lastDat.x);

            if(deltaYaw > 0 && deltaPitch > 5) {
                dP.unshift(deltaPitch);
                const outliers = getOutliersInt(dP, 1.5);

                if(outliers === 0 && (player.hasTag("attacking") || !config.modules.aimG.needHit)) {
                    setScore(player, "aimG_BUFFER", getScore(player, "aimG_BUFFER", 0) + 1);

                    if(getScore(player, "aimG_BUFFER", 0) > 20) {
                        flag(player, "Aim", "G", "Kuristosis (Beta)", "outliers", `${outliers},deltaPitch=${deltaPitch},deltaYaw=${deltaYaw}`, false);

                        setScore(player, "aimG_BUFFER", 0);
                    }
                }
                if(dP.length > 20) dP.pop();
            }
        }

        dataYaw.set(player.name, {y: rot.y, x: rot.x});
        dataPitch.set(player.name, dP);
    }
}