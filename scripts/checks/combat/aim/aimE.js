import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { countDuplicates, getAverage } from "../../../utils/maths/mathUtil.js";
import { getDeltaPitchList, getDeltaYawList} from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";

export function aim_e(player) {
    if(!allowedPlatform(player, config.modules.aimE.AP)) return;
    if(config.modules.aimE.enabled) {
        // If needHit is on, make sure the player has attacked
        if(config.modules.aimE.needHit && !player.hasTag("attacking")) return;

        const deltaYawData = getDeltaYawList(player);
        const deltaPitchData = getDeltaPitchList(player);

        // Pitch
        const deltaPitchAverage = getAverage(deltaPitchData);
        const deltaPitchMin = isomath.min(...deltaPitchData);
        const deltaPitchMax = isomath.max(...deltaPitchData);
        const deltaPitchLowCount = isomath.lessThan(deltaPitchData, 1.5);
        const deltaPitchHighCount = isomath.greaterThan(deltaPitchData, 7.5);
        const deltaPitchDuplicates = countDuplicates(deltaPitchData);

        // Yaw
        const deltaYawAverage = getAverage(deltaYawData);
        const deltaYawMin = isomath.min(...deltaYawData);
        const deltaYawMax = isomath.max(...deltaYawData);
        const deltaYawLowCount = isomath.lessThan(deltaYawData, 1.5);
        const deltaYawHighCount = isomath.greaterThan(deltaYawData, 7.5);
        const deltaYawDuplicates = countDuplicates(deltaYawData);


        const pitchChecks = deltaPitchAverage > 5.0;
        const yawChecks = deltaYawAverage > 5.0;

        if(pitchChecks) {
            const minMaxDelta = isomath.abs(deltaPitchMin - deltaPitchMax);
            if(minMaxDelta < 2) flagAim(player, `minMaxDelta:${minMaxDelta.toFixed(3)}`);

            if(deltaPitchLowCount < 3 && deltaPitchHighCount < 3) flagAim(player, `deltaYawLowCount:${deltaYawLowCount},deltaYawHighCount:${deltaYawHighCount}`);
        }

        if(yawChecks) {
            const minMaxDelta = isomath.abs(deltaYawMin - deltaYawMax);
            if(minMaxDelta < 4) flagAim(player, `minMaxDelta:${minMaxDelta.toFixed(3)}`);

            if(deltaYawLowCount < 4 && deltaYawHighCount < 4) flagAim(player, `deltaYawLowCount:${deltaYawLowCount},deltaYawHighCount:${deltaYawHighCount}`);

            
        }

    }
}

function flagAim(player, data) {
    flag(player, "Aim", "E", "Combat", "data", data, false);
}
