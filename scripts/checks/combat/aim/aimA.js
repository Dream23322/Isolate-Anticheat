import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { setTitle } from "../../../utils/gameUtil.js";
const data = new Map();
export function aim_a(player) {
    if(config.modules.aimA.enabled && data.has(player.name)) {
        const rot = player.getRotation();
        const data_yaw = data.get(player.name).yaw;
        const data_pitch = data.get(player.name).pitch;
        if(data_yaw && data_pitch) {
            const deltaPitch = Math.abs(rot.x - data_pitch.one);
            const deltaYaw = Math.abs(rot.y - data_yaw.one);

            const deltaPitch2 = Math.abs(data_pitch.one - data_pitch.two);
            const deltaYaw2 = Math.abs(data_yaw.one - data_yaw.two);
            
            const yawAccel = Math.abs(deltaYaw - deltaYaw2);
            const pitchAccel = Math.abs(deltaPitch - deltaPitch2);

            if(deltaYaw == 0 && deltaPitch == 0) return;

            if(deltaPitch > 15 && config.modules.aimA.diff < 0.05 || deltaPitch < config.modules.aimA.diff && deltaYaw > 15) {
                setScore(player, "aim_a_buffer", getScore(player, "aim_a_buffer", 0) + 1);
            }
            if(player.hasTag("aim_debug")) player.sendMessage("Yaw: " + deltaYaw.toFixed(4) + " Pitch: " + deltaPitch.toFixed(5));
            if(getScore(player, "aim_a_buffer", 0) > config.modules.aimA.buffer) {
                flag(player, "Aim", "A", "Combat", "Delta", `${deltaYaw},${deltaPitch}`, false);
                setScore(player, "aim_a_buffer", 0);
            }
            // Might make a new check with the other Data we have access to
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
