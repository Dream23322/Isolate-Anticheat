import { setScore, getScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { arrayToList, countDuplicates, findNearDuplicates, getAverage, getAverageDifference, getOutliersInt, isNearPerfectWave, isWavePattern } from "../../../utils/maths/mathUtil.js";
import { fastAbs } from "../../../utils/maths/fastMath.js";
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
                const isWave = isWavePattern(CPSList)
                if(isWave) {
                    setScore(player, "autoclickerE_buffer", getScore(player, "autoclickerE_buffer", 0) + 1);
                    if(getScore(player, "autoclickerE_buffer", 0) >= 5) {
                        flag(player, "AutoClicker", "E", "Kuristosis", "CPS", `${cpsOutliers},CPS=${player.cps},buffer=${getScore(player, "autoclickerE_buffer", 0)}`, true);
                        setScore(player, "autoclickerE_buffer", 0);
                    }
                }

                if(cpsOutliers < 2) flag(player, 'Autoclicker', "E", "Kuristosis", "CPS", player.cps, true);
                const averageCpsDiff = fastAb(getAverageDifference(CPSList));


                const cpsDuplicates = findNearDuplicates(CPSList);
                if(cpsDuplicates > 3) flag(player, "AutoClicker", "E", "Kuristosis", "CPS_DUPLICATES", cpsDuplicates, true);

                if(cpsOutliers < 3 && averageCpsDiff < 0.7 && (isWave || cpsDuplicates > 2)) {
                    flag(player, "AutoClicker", "E", "Kuristosis", "CPS", `${player.cps},total=${cpsOutliers + cpsDuplicates + (5 - averageCpsDiff)}`, true);
                }
            }

            d.unshift(player.cps);
            d.pop();
            
        }
        // Save last 10 CPS values 
        data.set(player.name, d);
    }
}