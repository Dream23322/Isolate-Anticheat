import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
const data = new Map();
export function aim_a(player) {
    if(config.modules.aimA.enabled && data.get(player.name)) {
        const rot = player.getRotation();
        const data_yaw = data.get(player.name).yaw;
        const data_pitch = data.get(player.name).pitch;
        if(data_yaw.one !== 0 && data_yaw.two !== 0 && data_yaw.three !== 0 && data_pitch.one !== 0 && data_pitch.two !== 0 && data_pitch.three !== 0) {
            const deltaPitch = Math.abs(rot.x - data_pitch.one);
            const deltaYaw = Math.abs(rot.y - data_yaw.one);

            const deltaPitch2 = Math.abs(data_pitch.one - data_pitch.two);
            const deltaYaw2 = Math.abs(data_yaw.one - data_yaw.two);

            const yawAccel = Math.abs(deltaYaw - deltaYaw2);
            const pitchAccel = Math.abs(deltaPitch - deltaPitch2);

            // Make sure that the player has moved their head.
            if(yawAccel == 0 || yawAccel == 0) return;

            if(yawAccel > 10 && pitchAccel < 0.1 || yawAccel < 0.1 && pitchAccel > 10) {
                setScore(player, "aim_a_buffer", getScore(player, "aim_a_buffer", 0) + 1);
            }
            setScore(player, "aim_a_reset", getScore(player, "aim_a_reset", 0) + 1);
            if(getScore(player, "aim_a_reset", 0) == 100) {
                if(getScore(player, "aim_a_buffer", 0) > config.modules.aimA.buffer) flag(player, "Aim", "A", "Combat", "buffer", getScore(player, "aim_a_buffer", 0), false);
                setScore(player, "aim_a_buffer", 0);
                setScore(player, "aim_a_reset", 0);
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
