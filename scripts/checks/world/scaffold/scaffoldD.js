import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { arrayToList, getAverageDifference } from "../../../utils/maths/mathUtil.js";
import { abs } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";

const data = new Map();
const data2 = new Map();

export function scaffold_d(player, block) {
    if(!allowedPlatform(player, config.modules.scaffoldD.AP)) return;
    if(config.modules.scaffoldD.enabled) {
        const rotation = player.getRotation();
        const d = data.get(player.name) ?? (new Array(5)).fill(0);
        const d2 = data2.get(player.name) ?? (new Array(5).fill(0));
        if(d) {
            const isBlockBelow = block.location.y < player.location.y

            const pitchList = arrayToList(d);
            const yawList = arrayToList(d2);

            const pitchDifferenceAverage = isomath.abs(getAverageDifference(pitchList));
            const yawDifferenceAverage = isomath.abs(getAverageDifference(yawList));

            if(
                isBlockBelow &&
                pitchDifferenceAverage > 0 &&
                pitchDifferenceAverage < 1 &&
                yawDifferenceAverage === 0
            ) flag(player, "Scaffold", "D", "Placement (BETA)", "data", `${pitchDifferenceAverage.toFixed(5)}, ${yawDifferenceAverage.toFixed(1)}`, false);

            d.unshift(rotation.x);
            d2.unshift(rotation.y);
            if(d.length > 5) d.pop();
            if(d2.length > 5) d2.pop();
            
        }

        data.set(player.name, d);
        data2.set(player.name, d2);
    }
}