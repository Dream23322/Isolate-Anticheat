import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

// Thank you Visual1mpact for helping me with the Map's


// Initialize scaffold_a_map if not present
const scaffold_a_map = new Map();
function is_diag(current, old, oldest) {
    // Check if the differences in X and Z coordinates form a diagonal pattern
    const diagonalX = Math.abs(current.x - old.x) === Math.abs(old.x - oldest.x);
    const diagonalZ = Math.abs(current.z - old.z) === Math.abs(old.z - oldest.z);

    // Return true if either X or Z coordinates form a diagonal pattern
    return diagonalX || diagonalZ;
}

function is_below(player, current, old, oldest) {
    return player.y - 1 === current.y && player.y - 1 === old.y && player.y - 1 === oldest.y;
}
export function scaffold_a(player, block) {
    if (config.modules.scaffoldA.enabled) {
        const playerRotation = player.getRotation();
        if(playerRotation.x % 1 === 0) {
            flag(player, "Scaffold", "A", "World", "player rot", playerRotation.x % 1, false);
        }
    }

    if (config.modules.scaffoldA.enabled && scaffold_a_map.has(player)) {
        const place_location = { x: block.location.x, y: block.location.y, z: block.location.z };
        const last_place_location = scaffold_a_map.get(player)?.a;
        const old_place_location = scaffold_a_map.get(player)?.b;
        const pitch_values = scaffold_a_map.get(player)?.pitch;
        const yaw_values = scaffold_a_map.get(player)?.yaw;
        if (last_place_location && old_place_location && pitch_values) {
            if (Math.abs(old_place_location.x) === Math.abs(last_place_location.x) && Math.abs(last_place_location.x) !== Math.abs(place_location.x) && place_location.y < player.location.y && last_place_location.y < player.location.y && old_place_location.y === player.location.y -1) {
                if (Math.abs(pitch_values.old - pitch_values.mid) < 3 && Math.abs(pitch_values.mid - player.getRotation().x) > 30) {
                    flag(player, "Scaffold", "A", "World", "pitch", player.getRotation().x, false);
                }
                
                // if(Math.abs(pitch_values.mid - player.getRotation().x) < 5 && Math.abs(yaw_values.mid - player.getRotation().y) > 30) {
                //     flag(player, "Scaffold", "A", "World", "yaw", Math.abs(yaw_values.mid - player.getRotation().y), false);
                // }          z`
            }
            if (Math.abs(old_place_location.z) === Math.abs(last_place_location.z) && Math.abs(last_place_location.z) !== Math.abs(place_location.z) && place_location.y < player.location.y && last_place_location.y < player.location.y && old_place_location.y === player.location.y -1) {
                if (Math.abs(pitch_values.old - pitch_values.mid) < 3 && Math.abs(pitch_values.mid - player.getRotation().x) > 30) {
                    flag(player, "Scaffold", "A", "World", "pitch", player.getRotation().x, false);
                }

            }
            if(Math.abs(place_location.x) === Math.abs(last_place_location.x) && Math.abs(last_place_location.x) === Math.abs(old_place_location.x) || Math.abs(place_location.z) === Math.abs(last_place_location.z) && Math.abs(place_location.z) === Math.abs(old_place_location.z)) {
                if(Math.abs(pitch_values.new - pitch_values.mid) > 0.05 && Math.abs(pitch_values.mid - pitch_values.old) > 0.05) {
                    if(Math.abs(yaw_values.new - yaw_values.mid) === 0 && Math.abs(yaw_values.mid - yaw_values.old) === 0) {
                        flag(player, "Scaffold", "A", "World", "yaw", player.getRotation().y, false);
                    }
                }
            }
            if (
                is_diag(place_location, last_place_location, old_place_location) &&
                is_below(player, place_location, last_place_location, old_place_location)
            ) {
                if (
                    Math.abs(pitch_values.new - pitch_values.mid) == 0 &&
                    Math.abs(pitch_values.new - pitch_values.old) == 0 ||
                    Math.abs(yaw_values.x - yaw_values.mid) == 0 &&
                    Math.abs(yaw_values.new - yaw_values.old) == 0
                ) {
                    if(!player.isSneaking) {
                        flag(player, "Scaffold", "A", "World", "diag", true, false);
                    }
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