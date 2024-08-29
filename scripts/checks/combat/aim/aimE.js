import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { arrayToList, countDuplicates, countRoundedValues, findNearDuplicates, getAverage, isNearPerfectWave } from "../../../utils/mathUtil.js";

const data = new Map();
const dataYaw = new Map();
const dataPitch = new Map();
const data3 = new Map();

export function aim_e(player) {
    if(config.modules.aimE.enabled) {
        // If needHit is on, make sure the player has attacked
        if(config.modules.aimE.needHit && !player.hasTag("attacking")) return;

        const currentRotation = player.getRotation();
        const d = data.get(player.name) ?? (new Array(50)).fill(0);
        const dYaw = dataYaw.get(player.name) ?? (new Array(100)).fill(0);
        const dPitch = dataPitch.get(player.name) ?? (new Array(100)).fill(0);
        if (data3.get(player.name) && d && dYaw) {

            const deltaYaw = Math.abs(currentRotation.y - data3.get(player.name).y);
            const deltaPitch = Math.abs(currentRotation.x - data3.get(player.name).x);
            if(deltaYaw < 5 || deltaPitch < 5) return;
            const lastDeltaYaw = Math.abs(data3.get(player.name).y - data3.get(player.name).y2);
            const lastDeltaPitch = Math.abs(data3.get(player.name).x - data3.get(player.name).x2);

            const yawAccel = Math.abs(deltaYaw - lastDeltaYaw);
            const pitchAccel = Math.abs(deltaPitch - lastDeltaPitch);

            const accel = Math.abs(yawAccel + pitchAccel);

            if(isNearPerfectWave(arrayToList(d), 0.1)) {
                setScore(player, "AimE_BUFFER", getScore(player, "AimE_BUFFER", 0) + 1);
                if(getScore(player, "AimE_BUFFER", 0) > 20) {
                    flag(player, "Aim", "E", "Kuristosis (Beta)", "wavePattern", "true", false);
                    setScore(player, "AimE_BUFFER", 0);
                }
            }
            
            const deltaDiff = Math.abs(deltaYaw - deltaPitch);
            if(deltaDiff < 0.1 && deltaYaw > 1) flag(player, "Aim", "E", "Kuristosis (Beta)", "deltaDiff", deltaDiff, false);

            const deltaYawAverage = getAverage(dYaw);
            const deltaYawDuplicates = findNearDuplicates(dYaw, 0);

            if(deltaYawAverage > 1 && deltaYawDuplicates > 5) flag(player, "Aim", "E", "Kuristosis (Beta)", "deltaYawDuplicates", deltaYawDuplicates, false);

            const deltaPitchAverage = getAverage(dPitch);
            const deltaPitchDuplicates = findNearDuplicates(dPitch, 0);

            if(deltaPitchAverage > 1 && deltaPitchDuplicates > 5) flag(player, "Aim", "E", "Kuristosis (Beta)", "deltaPitchDuplicates", deltaPitchDuplicates, false);

            const total = Math.abs(deltaYawDuplicates + deltaPitchDuplicates);

            if(total > config.modules.aimE.total) flag(player, "Aim", "E", "Kuristosis (Beta)", "total", total, false);

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
