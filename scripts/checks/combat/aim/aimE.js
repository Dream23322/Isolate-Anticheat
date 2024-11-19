import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { arrayToList, countDuplicates, countRoundedValues, findNearDuplicates, getAverage, getOutliersInt, isNearPerfectWave } from "../../../utils/mathUtil.js";
import { fastAbs, fastRound } from "../../../utils/fastMath.js";
import { getDeltaPitch, getDeltaYaw, getLastDeltaPitch, getLastDeltaYaw } from "./aimData.js";

const data = new Map();
const dataYaw = new Map();
const dataPitch = new Map();
const data3 = new Map();

export function aim_e(player) {
    if(!allowedPlatform(player, config.modules.aimE.AP)) return;
    if(config.modules.aimE.enabled) {
        // If needHit is on, make sure the player has attacked
        if(config.modules.aimE.needHit && !player.hasTag("attacking")) return;

        const currentRotation = player.getRotation();
        const d = data.get(player.name) ?? (new Array(50)).fill(0);
        const dYaw = dataYaw.get(player.name) ?? (new Array(100)).fill(0);
        const dPitch = dataPitch.get(player.name) ?? (new Array(100)).fill(0);
        if (data3.get(player.name) && d && dYaw) {

            const deltaYaw = getDeltaYaw(player);
            const deltaPitch = getDeltaPitch(player);
            if(deltaYaw < 5 || deltaPitch < 5) return;
            const lastDeltaYaw = getLastDeltaYaw(player);
            const lastDeltaPitch = getLastDeltaPitch(player);

            const yawAccel = fastAbs(deltaYaw - lastDeltaYaw);
            const pitchAccel = fastAbs(deltaPitch - lastDeltaPitch);

            const accel = fastAbs(yawAccel + pitchAccel);

            if(isNearPerfectWave(arrayToList(d), 0.1) && (player.hasTag("attacking") || !config.modules.aimE.needHit)) {
                setScore(player, "AimE_BUFFER", getScore(player, "AimE_BUFFER", 0) + 1);
                if(getScore(player, "AimE_BUFFER", 0) > 20) {
                    flag(player, "Aim", "E", "Kuristosis (Beta)", "wavePattern", "true", false);
                    setScore(player, "AimE_BUFFER", 0);
                }
            }
            
            const deltaDiff = fastAbs(deltaYaw - deltaPitch);
            if(deltaDiff < 0.1 && deltaYaw > 1 && (player.hasTag("attacking") || !config.modules.aimE.needHit)) flag(player, "Aim", "E", "Kuristosis (Beta)", "deltaDiff", deltaDiff, false);

            const oldDeltaDiff = fastAbs(lastDeltaYaw - lastDeltaPitch);
            if(fastAbs(oldDeltaDiff - deltaDiff) < 0.1 && (player.hasTag("attacking") || !config.modules.aimE.needHit)) flag(player, "Aim", "E", "Kuristosis (Beta)", "rotationDiff", fastAbs(oldDeltaDiff - deltaDiff), false);
            const deltaYawAverage = getAverage(dYaw);
            const deltaYawDuplicates = findNearDuplicates(dYaw, 0);

            if(deltaYawAverage > 1 && deltaYawDuplicates > 15 && (player.hasTag("attacking") || !config.modules.aimE.needHit)) flag(player, "Aim", "E", "Kuristosis (Beta)", "deltaYawDuplicates", deltaYawDuplicates, false);

            const deltaPitchAverage = getAverage(dPitch);
            const deltaPitchDuplicates = findNearDuplicates(dPitch, 0);

            if(deltaPitchAverage > 1 && deltaPitchDuplicates > 15 && (player.hasTag("attacking") || !config.modules.aimE.needHit)) flag(player, "Aim", "E", "Kuristosis (Beta)", "deltaPitchDuplicates", deltaPitchDuplicates, false);

            const total = fastAbs(deltaYawDuplicates + deltaPitchDuplicates);

            if(total > config.modules.aimE.total && (player.hasTag("attacking") || !config.modules.aimE.needHit)) flag(player, "Aim", "E", "Kuristosis (Beta)", "total", total, false);

            if(config.modules.aimE.experimental) {
                // const isRoundYaw = fastAbs(deltaYaw - fastRound(deltaYaw))
                // const isRoundPitch = fastAbs(deltaPitch - fastAbs(deltaPitch))
                // if(isRoundPitch < 0.01 || isRoundYaw < 0.01) flag(player, "Aim", "E", "Kuristosis (Beta)", "roundDiffA", `Pitch: ${isRoundPitch}, Yaw: ${isRoundYaw}`, false);
                const pitchDeltaDelta = fastAbs(deltaPitch - lastDeltaPitch);
                const isRoundDiffPitch = fastAbs(pitchDeltaDelta - fastRound(pitchDeltaDelta));

                const yawDeltaDelta = fastAbs(deltaYaw - lastDeltaYaw);
                const isRoundDiffYaw = fastAbs(yawDeltaDelta - fastRound(yawDeltaDelta));   

                if(isRoundDiffPitch < 0.01 && isRoundDiffYaw < 0.2 || isRoundDiffYaw < 0.01 && isRoundDiffPitch < 0.2) flag(player, "Aim", "E", "Kuristosis (Beta)", "roundDiffB", `Pitch: ${isRoundDiffPitch}, Yaw: ${isRoundDiffYaw}`, false);

                if(deltaPitchAverage < 6 && getOutliersInt(dPitch, 1.5) === 0) flag(player, "Aim", "E", "Kuristosis (Beta)", "pitchAverage", deltaPitchAverage, false);
                if(player.hasTag("aimEDEBUG")) player.sendMessage("AimE: " + deltaPitchAverage + ", " + deltaYawAverage);
            }

            dYaw.unshift(deltaYaw);
            dYaw.pop();
            dPitch.unshift(deltaPitch);
            dPitch.pop();

            d.unshift(accel);
            d.pop();
        
        }

        data.set(player.name, d);
        dataYaw.set(player.name, dYaw);
        dataPitch.set(player.name, dPitch);
        data3.set(player.name, {
            x: currentRotation.x,
            y: currentRotation.y,
            x2: data3.get(player.name)?.x,
            y2: data3.get(player.name)?.y
        });
    }
}
