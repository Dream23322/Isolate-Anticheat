import { debug, flag } from "../../../util";
import { getAverage, getStandardDeviation } from "../../../utils/mathUtil";
import config from "../../../data/config.js";
const EvictingList = require("../../../utils/data/evlist");
const data = new Map();
const buffer = new Map();
export function aim_d(player) {
    const yASamples = new EvicitingList(20);
    const pASamples = new EvictingList(20);
    if(config.modules.aimD.enabled && data.get(player)) {
        const data_yaw = data.get(player.name).yaw;
        const data_pitch = data.get(player.name).pitch;
        if(data_yaw && data_pitch) {
            const deltaPitch = Math.abs(rot.x - data_pitch.one);
            const deltaYaw = Math.abs(rot.y - data_yaw.one);

            const deltaPitch2 = Math.abs(data_pitch.one - data_pitch.two);
            const deltaYaw2 = Math.abs(data_yaw.one - data_yaw.two);
            
            const yawAccel = Math.abs(deltaYaw - deltaYaw2);
            const pitchAccel = Math.abs(deltaPitch - deltaPitch2);

            yASamples.add(yawAccel);
            pASamples.add(pitchAccel);
            if(yASamples.isFull() && pASamples.isFull()) {
                const yawAccelAverage = getAverage(yASamples);
                const pitchAccelAverage = getAverage(pASamples);

                const yawAccelDeviation = getStandardDeviation(yASamples);
                const pitchAccelDeviation = getStandardDeviation(pASamples);
                if(player.hasTag("aimd_debug")) debug(player, `Yaw: ${yawAccelAverage.toFixed(4)} Pitch: ${pitchAccelAverage.toFixed(5)}`);
                const exemptRotation = deltaYaw < 1.5;

                const averageInvalid = yawAccelAverage < 1 || pitchAccelAverage && !exemptRotation;
                const devationInvalid = yawAccelDeviation < 5 && pitchAccelDeviation > 5 && !exemptRotation;
                if(averageInvalid || devationInvalid) {
                    if(buffer.get(player.name)) {
                        if(buffer.get(player.name) > config.modules.aimD.buffer) {
                            flag(player, "Aim", "D", "Combat (BETA)", "yawAccelAvg", `${yawAccelAverage},yawAccelDevation=${yawAccelDeviation}`, false);
                            buffer.set(player.name, -1);
                        }
                    }
                    buffer.set(player.name, (buffer.get(player.name) || 0) + 1);
                }
            }
        }
    }
    data.set(player.name, {
        pitch: {
            one: player.getRotation().x,
            two: data.get(player.name)?.pitch.one || 0,
            three: data.get(player.name)?.pitch.two || 0
        },
        yaw: {
            one: player.getRotation().y,
            two: data.get(player.name)?.yaw_one || 0,
            three: data.get(player.name)?.yaw_two || 0
        }
    })
}