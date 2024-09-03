import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { arrayToList, getAverage, getgcd, getGcdFloat, getStandardDeviationV2 } from "../../../utils/mathUtil.js";
import { fastAbs } from "../../../utils/fastMath.js";

const data = new Map();
const yawAccelD = new Map();
const pitchAccelD = new Map();
export function aim_f(player) {
    if(config.modules.aimF.enabled) {
        const rotation = player.getRotation();
        const d = data.get(player.name) || null;

        const yawSamples = yawAccelD.get(player.name) || (new Array(20)).fill(0);
        const pitchSamples = pitchAccelD.get(player.name) || (new Array(20)).fill(0);
        if(d != null) {
            const deltaPitch = fastAbs(rotation.x - d.one);
            const lastDeltaPitch = fastAbs(d.one - d.two);
            
            const deltaYaw = fastAbs(rotation.y - d.three);
            const lastDeltaYaw = fastAbs(d.three - d.four);

            const yawAccel = fastAbs(deltaYaw - lastDeltaYaw);
            const pitchAccel = fastAbs(deltaPitch - lastDeltaPitch);

            // Make sure there is enough data in the arrays
            if(yawSamples.length >= 20) {
                const yawAccelList = arrayToList(yawSamples);
                const pitchAccelList = arrayToList(pitchSamples);

                const yawAccelAverage = getAverage(yawAccelList);
                const pitchAccelAverage = getAverage(pitchAccelList);

                const yawAccelDeviation = getStandardDeviationV2(yawAccelList);
                const pitchAccelDeviation = getStandardDeviationV2(pitchAccelList);

                const exemptRotation = deltaYaw < 1.5;

                const averageInvalid = yawAccelAverage < 1 || pitchAccelAverage < 1 && !exemptRotation;
                const deviationInvalid = yawAccelDeviation < 5 && pitchAccelDeviation > 5 && !exemptRotation;

                // debug
                if(player.hasTag("aimFDebug")) {
                    player.runCommandAsync(`tell @a Yaw: ${yawAccelAverage} | Pitch: ${pitchAccelAverage} | YawDeviation: ${yawAccelDeviation} | PitchDeviation: ${pitchAccelDeviation}`);
                }

                if(averageInvalid && deviationInvalid && (player.hasTag("attacking") || !config.modules.aimF.needHit)) {
                    setScore(player, "aimF_buffer", getScore(player, "aimF_buffer", 0) + 1);
                    if(getScore(player, "aimF_buffer", 0) > config.modules.aimF.buffer) {
                        flag(player, "Aim", "F", "Combat (Beta)", "aimF", "yaw: " + yawAccelAverage + " | pitch: " + pitchAccelAverage + " | yawDeviation: " + yawAccelDeviation + " | pitchDeviation: " + pitchAccelDeviation, false);
                        setScore(player, "aimF_buffer", 0);
                    }
                }

            }

            yawSamples.unshift(yawAccel);
            yawSamples.pop();

            pitchSamples.unshift(pitchAccel);
            pitchSamples.pop();
        }

        data.set(player.name, {
            one: rotation.x,
            two: data.get(player.name)?.one || 0,
            three: rotation.y,
            four: data.get(player.name)?.three || 0
        })

        yawAccelD.set(player.name, yawSamples);
        pitchAccelD.set(player.name, pitchSamples);
    }
}