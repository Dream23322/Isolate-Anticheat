import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { arrayToList, countDuplicates, findNearDuplicates, getAverage, getAverageDifference, getOutliersInt, isNearPerfectWave, isWavePattern } from "../../../utils/maths/mathUtil.js";
import * as isomath from "../../../utils/maths/isomath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
const data = new Map();
export function autoclicker_e(player) {
    if(!allowedPlatform(player, config.modules.autoclickerE.AP)) return;
    if(config.modules.autoclickerE.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerE.checkCPSAfter) {

        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        const d = data.get(player.name) ?? (new Array(19)).fill(0);
        if(d && player.cps > 10) {
            const CPSList = arrayToList(d);
            CPSList.push(player.cps);

            const cpsOutliers = getOutliersInt(CPSList, 3);
            if(d.length > 18 && getAverage(CPSList) > 13) {

                if(cpsOutliers < 2) flag(player, 'Autoclicker', "E", "Combat", "CPS_OUTLIERS", cpsOutliers, true);
                const averageCpsDiff = fastAb(getAverageDifference(CPSList));

                // Cps duplicates check
                const cpsDuplicates = findNearDuplicates(CPSList);
                if(cpsDuplicates > 3) flag(player, "AutoClicker", "E", "Combat", "CPS_DUPLICATES", cpsDuplicates, true);

                // Cps range check
                const cpsRange = isomath.range(CPSList);
                if(cpsRange < 4) flag(player, "AutoClicker", "E", "Combat", "CPS_RANGE", cpsRange, false);

                // Standard deviation check
                const stDev = isomath.getStandardDeviation(CPSList, isomath.getAverage(CPSList));
                if(stDev < 2) flag(player, "AutoClicker", "E", "Combat", "STANDARD_DEVIATION", stDev, false);

                // Delta standard deviation check
                const data1 = CPSList.splice(0, 10);
                const data2 = CPSList.splice(0, 10);

                const stDev1 = isomath.getStandardDeviation(data1, isomath.getAverage(data1));
                const stDev2 = isomath.getStandardDeviation(data2, isomath.getAverage(data2));

                const stDevDelta = isomath.abs(stDev1 - stDev2);

                if(stDevDelta < 0.1) flag(player, "Autoclicker", "E", "Combat", "STANDARD_DEVIATION_DELTA", stDevDelta, false);

                if(cpsOutliers < 3 && averageCpsDiff < 0.7 && (isWave || cpsDuplicates > 2)) {
                    flag(player, "AutoClicker", "E", "Combat", "CPS", `${player.cps},total=${cpsOutliers + cpsDuplicates + (5 - averageCpsDiff)}`, true);
                }
            }

            d.unshift(player.cps);
            d.pop();
            
        }
        // Save last 10 CPS values 
        data.set(player.name, d);
    }
}