import { getScore, setScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { amountDeltaPitch } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";

export function aim_i(player) {
    if(!allowedPlatform(player, config.modules.aimI.AP || !config.modules.aimI.enabled || (config.modules.aimI.needHit && !player.hasTag("attacking")))) return;

    const pitchData = amountDeltaPitch(player, 30);

    const averageDP = isomath.getAverage(pitchData);

    const minMaxDiff = isomath.abs(isomath.min(...pitchData) - isomath.max(...pitchData));

    if(averageDP > config.modules.aimI.minAvg && minMaxDiff < config.modules.aimI.maxDiff) flag(player, "Aim", "I", "Pitch", "avgDP", averageDP + ",minMaxDiff=" + minMaxDiff, true);
}