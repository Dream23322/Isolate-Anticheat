import { flag } from "../../../utils/anticheat/punishment/flag";
import config from "../../../data/config";
import * as isomath from "../../../utils/maths/isomath";
import { amountDeltaPitch } from "./aimData";

export function aim_f(player) {
    if(!allowedPlatform(player) || !config.modules.aimF.enabled) return;

    // Pitch
    const dataPitch = amountDeltaPitch(player, 40);

    const dataPitchFirst = dataPitch.slice(0, 20);
    const dataPitchSeond = dataPitch.slice(20, 40);

    const averageDeltaPitchFirst = isomath.getAverage(dataPitchFirst);
    const averageDeltaPitchSecond = isomath.getAverage(dataPitchSeond);

    const stDevDPF = isomath.getStandardDeviation(dataPitchFirst, averageDeltaPitchFirst);
    const stDevDPS = isomath.getStandardDeviation(dataPitchSeond, averageDeltaPitchSecond);

    // Yaw
    const dataYaw = amountDeltaYaw(player, 40);

    const dataYawFirst = dataYaw.slice(0, 20);
    const dataYawSeond = dataYaw.slice(20, 40);

    const averageDeltaYawFirst = isomath.getAverage(dataYawFirst);
    const averageDeltaYawSecond = isomath.getAverage(dataYawSeond);

    const stDevDYF = isomath.getStandardDeviation(dataYawFirst, averageDeltaYawFirst);
    const stDevDYS = isomath.getStandardDeviation(dataYawSeond, averageDeltaYawSecond);

    // Get differences
    const deltaStPitchDev = isomath.abs(stDevDPF - stDevDPS);
    const deltaStYawDev = isomath.abs(stDevDYF - stDevDYS);

    if(deltaStPitchDev < 0.1 && averageDeltaPitchFirst > 5 || deltaStYawDev < 0.1 && averageDeltaYawFirst > 5) flag(player, "Aim", "F", "Combat (BETA)", "stDev", `${deltaStPitchDev.toFixed(3)},${deltaStYawDev.toFixed(3)}`, true);
}