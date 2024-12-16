import { getScore, setScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { abs, round } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { getDeltaPitch, getDeltaPitchArray, getDeltaYaw, amountDeltaPitch, amountDeltaYaw } from "./aimData.js";
import  * as isomath from "../../../utils/maths/isomath.js";

const data = new Map();

export function aim_h(player) {
    if(config.modules.aimH.enabled) {
        if(!allowedPlatform(player, config.modules.aimH.AP) || (config.modules.aimH.needHit && !player.hasTag("attacking"))) return;

        const averageDeltaPitch = isomath.getAverage(amountDeltaPitch(player, 10));
        const stDevPitch = isomath.getStandardDeviation(amountDeltaPitch(player, 10), averageDeltaPitch);
        
        const averageDeltaYaw = isomath.getAverage(amountDeltaYaw(player, 10));
        const stDevYaw = isomath.getStandardDeviation(amountDeltaYaw(player, 10), averageDeltaYaw);

        // Pitch 
        if(averageDeltaPitch > config.modules.aimH.minAvg && stDevPitch < config.modules.aimH.maxStDev) flag(player, "Aim", "H", "Combat", "stDevP", stDevPitch + ",avgdp=" + averageDeltaPitch, true);

        // Yaw
        if(averageDeltaYaw > config.modules.aimH.minAvg && stDevYaw < config.modules.aimH.maxStDev) flag(player, "Aim", "H", "Combat", "stDevY", stDevYaw + ",avgdy=" + averageDeltaYaw, true);
    }
}