import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

// Thank you Visual1mpact for helping me with the Map's
// Initialize scaffold_a_map if not present
const scaffold_a_map = new Map();

function is_diag_recode(neww, player, old) {
    return Math.abs(neww.x) !== Math.abs(old.x) && Math.abs(neww.z) !== Math.abs(old.z) && (Math.abs(neww.x - old.x) < 2) && (Math.abs(neww.z - old.z) < 2) && Math.abs(neww.y < player.location.y)
}

function is_decrease(player, one, two, three) {
    const distance_one = Math.sqrt(Math.pow(one.x - player.location.x, 2) + Math.pow(one.z - player.location.z, 2));
    const distance_two = Math.sqrt(Math.pow(two.x - player.location.x, 2) + Math.pow(two.z - player.location.z, 2));
    const distance_three = Math.sqrt(Math.pow(three.x - player.location.x, 2) + Math.power(three.z - player.location.z, 2));
    const one_three = Math.sqrt(Math.pow(one.x - three.x, 2) + Math.pow(one.z - three.z, 2)) == 1;
    return one_three && distance_one > distance_two && distance_one > distance_two && distance_two > distance_three;
}
export function scaffold_a(player, block) {
    if (config.modules.scaffoldA.enabled && scaffold_a_map.has(player)) {
        const place_location = { x: block.location.x, y: block.location.y, z: block.location.z };
        const last_place_location = scaffold_a_map.get(player)?.a;
        const old_place_location = scaffold_a_map.get(player)?.b;
        const pitch_values = scaffold_a_map.get(player)?.pitch;
        const yaw_values = scaffold_a_map.get(player)?.yaw;
        const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));
        if (last_place_location && old_place_location && pitch_values) {
            if(Math.abs(place_location.x) === Math.abs(last_place_location.x) && Math.abs(last_place_location.x) === Math.abs(old_place_location.x) || Math.abs(place_location.z) === Math.abs(last_place_location.z) && Math.abs(place_location.z) === Math.abs(old_place_location.z)) {
                if(Math.abs(pitch_values.new - pitch_values.mid) > 0.05 && Math.abs(pitch_values.mid - pitch_values.old) > 0.05) {
                    if(Math.abs(yaw_values.new - yaw_values.mid) === 0 && Math.abs(yaw_values.mid - yaw_values.old) === 0) {
                        flag(player, "Scaffold", "A", "World", "yaw", player.getRotation().y, false);
                    }
                }
            }
            if (
                is_diag_recode(place_location, player, old_place_location)
            ) {
                if (
                    Math.abs(pitch_values.new - pitch_values.mid) == 0 &&
                    Math.abs(pitch_values.new - pitch_values.old) == 0 &&
                    Math.abs(yaw_values.new - yaw_values.mid) !== 0 &&
                    Math.abs(yaw_values.new - yaw_values.old) !== 0 ||
                    Math.abs(yaw_values.new - yaw_values.mid) == 0 &&
                    Math.abs(yaw_values.new - yaw_values.old) == 0 &&
                    Math.abs(pitch_values.new - pitch_values.mid) !== 0 &&
                    Math.abs(pitch_values.new - pitch_values.old) !== 0
                ) {
                    if(!player.isSneaking) {
                        flag(player, "Scaffold", "A", "World", "no-rot-diff", "true", false);
                    }
                }
                const rotx = player.getRotation().x;
                if(distance > 3.5 && !is_decrease(player, place_location, last_place_location, old_place_location)) {
                    flag(player, "Scaffold", "A", "World", "distance", distance, false);
                }
                if (Math.abs(yaw_values.new - player.getRotation().z) < 2) {
                    flag(player, "Scaffold", "A", "World", "yaw", player.getRotation().z, false);
                }
                if(yaw_values.new < -141 && yaw_values.new > -142) {
                    flag(player, "Scaffold", "A", "World", "Yaw", yaw_values.new, false);
                }
                if(yaw_values.new == yaw_values.mid) {
                    flag(player, "Scaffold", "A", "World", "Yaw_Diff", 0, false);
                }
                if(rotx < 44.5 && pitch_values.mid < 44.5 && distance < 1) {
                    flag(player, "Scaffold", "A", "World", "Pitch", pitch_values.new, false);
                }
                if(rotx < 54 && pitch_values.mid < 54 && distance < 0.4) {
                    flag(player, "Scaffold", "A", "World", "Pitch", rotx, false);
                }
                if(rotx > 60 && pitch_values.mid < 60 && distance > 1.9) {
                    flag(player, "Scaffold", "A", "World", "dist", distance, false);
                }
   
                if(Math.abs(yaw_values.new + yaw_values.mid + yaw_values.old) / 3 < 3 || Math.abs(pitch_values.new + pitch_values.mid + pitch_values.old) / 3 < 4) {
                    flag(player, "Scaffold", "A", "World", "Rot Diff", Math.abs(Math.abs(yaw_values.new + yaw_values.mid + yaw_values.old) / 3 + Math.abs(pitch_values.new + pitch_values.mid + pitch_values.old) / 3) / 2, false);
                }
            }
            
        }
    }

    scaffold_a_map.set(player, {
        a: { x: block.location.x, y: block.location.y, z: block.location.z },
        b: scaffold_a_map.get(player)?.a || { x: 0, y: 0, z: 0 },
        pitch: {
            new: player.getRotation().x,
            mid: scaffold_a_map.get(player)?.pitch?.new || 0,
            old: scaffold_a_map.get(player)?.pitch?.mid || 0
        },
        yaw: {
            new: player.getRotation().z,
            mid: scaffold_a_map.get(player)?.yaw?.new || 0,
            old: scaffold_a_map.get(player)?.yaw?.mid || 0
        }
    });
}