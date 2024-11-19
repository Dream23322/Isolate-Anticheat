import { flag} from "../../../util";
import config from "../../../data/config.js";
import { arrayToList, getAverageDifference } from "../../../utils/mathUtil.js";
import { fastAbs } from "../../../utils/fastMath.js";

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

            const pitchDifferenceAverage = fastAbs(getAverageDifference(pitchList));
            const yawDifferenceAverage = fastAbs(getAverageDifference(yawList));

            if(
                isBlockBelow &&
                pitchDifferenceAverage > 0 &&
                pitchDifferenceAverage < 1 &&
                yawDifferenceAverage == 0
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