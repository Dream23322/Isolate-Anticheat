import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { getBlocksBetween, hVelocity, hVelocity_2 } from "../../../utils/mathUtil.js";
import { aroundAir } from "../../../utils/gameUtil.js";
const motion_c_map = new Map();
export function motion_c(player) {
    if(config.modules.motionC.enabled && player.isOnGround && getScore(player, "tick_counter2", 0) > 5) {
        if(motion_c_map.has(player)) {
            const last_pos = motion_c_map.get(player).pos;
            const last_velocity = motion_c_map.get(player).velocity;
            const location = {x: player.location.x, y: player.location.y, z: player.location.z};
            if(player.hasTag("motion-debug")) {
                player.sendMessage(`Pos Diff ${Math.abs(location.x - last_pos.x)} y: ${Math.abs(location.y - last_pos.y)} z: ${Math.abs(location.z - last_pos.z)} YPos-Diff ${Math.abs(location.y - last_pos.y)} Velocity: X ${player.getVelocity().x} Y ${player.getVelocity().y} Z ${player.getVelocity().z}`);
            }
            if(last_pos.x == location.x && last_pos.y == location.y && last_pos.z == location.z && last_velocity.x !== 0 && player.getVelocity().x !== 0 && player.getVelocity().z !== 0 && last_velocity.z !== 0 && player.getVelocity().y == 0) {
                let min_h = config.modules.motionC.min_velocity;
                // Adjust the min velocity
                if(player.hasTag("placing")) min_h += 3;
                if(player.hasTag("gliding")) min_h += 2;
                if(player.hasTag("strict")) min_h -= 1;
                // Cancel check
                if(player.hasTag("swimming")) return;
                if(hVelocity_2(player) > min_h) setScore(player, "motion_c_data", getScore(player, "motion_c_data") + 1);
                if(getScore(player, "motion_c_data") > 5) flag(player, "Motion", "C", "Movement", "velocity", `X ${player.getVelocity().x} Y ${player.getVelocity().y} Z ${player.getVelocity().z}`, false);
            }
        }
        motion_c_map.set(player, {velocity: player.getVelocity(), pos: {x: player.location.x, y: player.location.y, z: player.location.z}});
    }
}