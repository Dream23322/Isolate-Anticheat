import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs, fastRound } from "../../../utils/fastMath.js";
import { getDeltaPitch, getDeltaYaw, getLastDeltaPitch, getLastDeltaYaw } from "./aimData.js";
import { arrayToList, countDuplicates, getOutliers, getOutliersInt } from "../../../utils/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const dataPitch = new Map();
const dataYaw = new Map();

export function aim_i(player) {
    return;
    if(!allowedPlatform(player, config.modules.aimI.AP)) return;
    if(!config.modules.aimI.enabled || !player.hasTag("attacking") && config.modules.aimI.needHit) return;

    const deltaPitch = getDeltaPitch(player);
    const deltaYaw = getDeltaYaw(player);
z
    const differencePitch = fastAbs(deltaPitch - getLastDeltaPitch(player));
    const differenceYaw = fastAbs(deltaYaw - getLastDeltaYaw(player));

    const joltX = fastAbs(deltaPitch - differencePitch);
    const joltY = fastAbs(deltaYaw - differenceYaw);
    if(joltX != 0.0 && joltY != 0.0) {
        // Setup Arraylists
        const dPitch = dataPitch.get(player.name) ?? (new Array(30)).fill(0);
        const dYaw = dataYaw.get(player.name) ?? (new Array(30)).fill(0);

        dPitch.unshift(joltX);
        dYaw.unshift(joltY);

        if(dPitch.length > 30) dPitch.pop();
        if(dYaw.length > 30) dYaw.pop();

        if(dPitch.length > 29 && dYaw.length > 29) {
            const outliersX = getOutliersInt(dPitch, 1.5);
            const outliersY = getOutliersInt(dYaw, 1.5);

            const duplicatesX = countDuplicates(arrayToList(dPitch))
            const duplicatesY = countDuplicates(arrayToList(dYaw));

            if(duplicatesX + duplicatesY == 0 && outliersX < 10 && outliersY < 10) {
                flag(player, "Aim", "I", "Kuristosis (Beta)", "outliers", `${outliersX}, ${outliersY}, duplicatesX=${duplicatesX}, duplicatesY=${duplicatesY}`, false);
            }
            if(player.hasTag("aimIDebug")) console.warn("AimI", outliersX, outliersY, duplicatesX, duplicatesY);
        }

        dataPitch.set(player.name, dPitch);
        dataYaw.set(player.name, dYaw);
        
    }
}