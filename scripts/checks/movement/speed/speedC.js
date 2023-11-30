import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

export function speed_c(player, tick_counter, speedCLog) {
    const playerSpeed = getSpeed(player);
    // Check if Speed/C is enabled in the config and that it has run at least once
    if(config.modules.speedC.enabled && speedCLog.get(player)) {
        // Get the max BPS of a player
        let max_bps_h = config.modules.speedC.max_bps_h;
        let max_bps_v = config.modules.speedC.max_bps_v;
        
        // Get the current position of the player
        const current_pos = {x: player.location.x, y: player.location.y, z: player.location.z};
        // Get the last position of the player
        const last_pos = speedCLog.get(player) || {x: player.location.x, y: player.location.y, z: player.location.z};
        if(playerSpeed < 0.1) {
            if(Math.abs((current_pos.x - last_pos.x) + (current_pos.z - last_pos.z) / 2) > max_bps_v) {
                player.addTag("no_speed_c");
            }
        }

        // To try stop false flags, we need to try check if a player is under conditions where they could have been teleported
        if(Number.isInteger(current_pos.x) || Number.isInteger(current_pos.z)) {
            player.addTag("no_speed_c");
        }
        // Make sure the tick counter is 19 so that we don't check every tick
        // If we check every tick, it will be blocks per tick, not block per second
        if(tick_counter === 19) {
            // If the player has speed, take that into account for horizontal BPS
            if(player.getEffect("speed")) {
                const speed_value = player.getEffect("speed").amplifier;
                const old_max_bps = max_bps_h;
                max_bps_h = Math.abs(speed_value + old_max_bps);
            }
            // If the player has jump_boost then take that into account for vertical BPS
            if(player.getEffect("jump_boost")) {
                const jump_boost_value = player.getEffect("jump_boost").amplifier;
                const old_max_bps_2 = max_bps_v;
                max_bps_v = Math.abs(jump_boost_value + old_max_bps_2);
            }

            // Calculate the BPS of the player
            const xz_bps = Math.abs((current_pos.x - last_pos.x) + (current_pos.z - last_pos.z) / 2);
            const y_bps = Math.abs((current_pos.y - last_pos.y));
            if(current_pos.y < 0 || last_pos.y < 0) return;
            const xyz_bps = Math.abs((current_pos.x - last_pos.x) + (current_pos.y - last_pos.y) + (current_pos.z - last_pos.z) / 3);
            if(player.hasTag("speedC")) {
                console.log(`player xz: ${xz_bps} xyz: ${xyz_bps} y_bps: ${y_bps}`);
            }
            // Calculate the max XYZ bps
            const max_xyz_bps = Math.abs((max_bps_h + max_bps_v) / 2);
            // Check if the player is under conditions that could cause the player to flag the check even if they are not cheating or using client mods
            if(!player.hasTag("ice") && !player.isFlying && !player.isGliding && (!player.hasTag('damaged') || player.hasTag("fall_damage")) && !player.hasTag("no_speed_c")) {
                player.removeTag("speedC_bypass");
                // Check for xz bps being too high
                if(xz_bps > max_bps_h && !player.hasTag("speedC_bypass")) {
                    flag(player, "Speed", "C", "Movement", "xz_bps", xz_bps, false);
                    player.addTag("speedC_bypass");
                }
                // Check for y bps being too high
                if(y_bps > max_bps_v && player.fallDistance < 10 && !player.hasTag("slime") && !player.hasTag("speedC_bypass")) {
                    flag(player, "Speed", "C", "Movement", "y_bps", y_bps, false);
                    player.addTag("speedC_bypass");
                }
                // Check for xyz bps being too high
                if(xyz_bps > max_xyz_bps + 3 && !player.fallDistance < 25 && !player.hasTag("slime") && !player.hasTag("speedC_bypass")) {
                    flag(player, "Speed", "C", "Movement", "xyz_bps", xyz_bps, false);
                    player.addTag("speedC_bypass");
                }
            }
            player.removeTag("no_speed_c");   
        }
    }
    if(tick_counter == 1) {
        speedCLog.set(player, {x: player.location.x, y: player.location.y, z: player.location.z});
    }
}