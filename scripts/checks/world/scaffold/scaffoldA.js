import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

// Thank you Visual1mpact for helping me with the Map's
// Initialize scaffold_a_map if not present
const scaffold_a_map = new Map();

function is_diag_recode(neww, player, old) {
    return Math.abs(neww.x) !== Math.abs(old.x) && Math.abs(neww.z) !== Math.abs(old.z) && (Math.abs(neww.x - old.x) < 2) && (Math.abs(neww.z - old.z) < 2) && Math.abs(neww.y < player.location.y) && old.y === neww.y
}

function is_decrease(origin, point1, point2, point3) {
    const distance1 = calculateDistance(origin, point1);
    const distance2 = calculateDistance(origin, point2);
    const distance3 = calculateDistance(origin, point3);
    const isOneThreeDistanceEqual = calculateDistance(point1, point3) === 1;
    
    return (
        isOneThreeDistanceEqual &&
        distance1 > distance2 &&
        distance1 > distance3 &&
        distance2 > distance3
    );
}

function calculateDistance(origin, point) {
    const dx = point.x - origin.x;
    const dz = point.z - origin.z;
    
    return Math.hypot(dx, dz);
}
export function scaffold_a(player, block) {
    if (config.modules.scaffoldA.enabled && scaffold_a_map.has(player) && !player.hasTag("gmc") && !player.hasTag("op")) {
        const place_location = { x: block.location.x, y: block.location.y, z: block.location.z };
        const last_place_location = scaffold_a_map.get(player)?.a;
        const old_place_location = scaffold_a_map.get(player)?.b;
        const pitch_values = scaffold_a_map.get(player)?.pitch;
        const yaw_values = scaffold_a_map.get(player)?.yaw;
        const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));
        if (last_place_location && old_place_location && pitch_values) {
            const xDist = Math.abs(place_location.x) - Math.abs(last_place_location.x);
            const zDist = Math.abs(place_location.z) - Math.abs(last_place_location.z);
            const isSameX = xDist === 0 && xDist === Math.abs(old_place_location.x);
            const isSameZ = zDist === 0 && zDist === Math.abs(old_place_location.z);

            if (isSameX || isSameZ) {
                const isPitchChange = Math.abs(pitch_values.new - pitch_values.mid) > 0.05 &&
                                       Math.abs(pitch_values.mid - pitch_values.old) > 0.05;
                const isYawSame = Math.abs(yaw_values.new - yaw_values.mid) === 0 &&
                                  Math.abs(yaw_values.mid - yaw_values.old) === 0;

                if (isPitchChange && isYawSame) {
                    flag(player, "Scaffold", "A", "World", "yaw(1)", player.getRotation().y, false);
                }
            }
            if (
                is_diag_recode(place_location, player, old_place_location)
            ) {
                
                const isPitchEqual = Math.abs(pitch_values.new - pitch_values.mid) === 0
                                    && Math.abs(pitch_values.new - pitch_values.old) === 0;
                const isYawEqual = Math.abs(yaw_values.new - yaw_values.mid) === 0
                                 && Math.abs(yaw_values.new - yaw_values.old) === 0;
                const arePitchAndYawDifferent = Math.abs(pitch_values.new - pitch_values.mid) !== 0 
                                           && Math.abs(yaw_values.new - yaw_values.mid) !== 0;
                const isDiagonalConditionMet = isPitchEqual && isYawEqual ||
                                              isYawEqual && isPitchEqual && arePitchAndYawDifferent;
                if (isDiagonalConditionMet) {
                    if(!player.isSneaking) {
                        flag(player, "Scaffold", "A", "World", "no-rot-diff", "true", false);
                    }
                }
                const rotx = player.getRotation().x;

                const diff_1 = Math.abs(yaw_values.mid - yaw_values.new);   
                const diff_2 = Math.abs(yaw_values.new - player.getRotation().y);
                console.warn("Diff1" + diff_1 + "Diff2 " + diff_2);
                if(diff_2 < 10 && diff_1 < 10 && !is_decrease(player, place_location, last_place_location, old_place_location) && diff_1 > 2 && diff_2 > 2) {
                    flag(player, "Scaffold", "A", "World", "Yaw Diff (2)", (diff_1 + diff_2) / 2, false);
                }


                // if(distance > 3.5 && !is_decrease(player, place_location, last_place_location, old_place_location)) {
                //     flag(player, "Scaffold", "A", "World", "distance", distance, false);
                // }
                if(rotx < 44.5 && pitch_values.mid < 44.5 && distance < 1) {
                    flag(player, "Scaffold", "A", "World", "Pitch(1)", pitch_values.new, false);
                } 
                // if(rotx > 60 && pitch_values.mid < 60 && distance > 1.9) {
                //     flag(player, "Scaffold", "A", "World", "dist", distance, false);
                // }
                if(getSpeed(player) > 1) {
                    flag(player, "Scaffold", "A", "World", "Speed", getSpeed(player), false);
                }
            }
            
        }
    }
    const rotation = player.getRotation();
    scaffold_a_map.set(player, {
        a: { x: block.location.x, y: block.location.y, z: block.location.z },
        b: scaffold_a_map.get(player)?.a || { x: 0, y: 0, z: 0 },
        pitch: {
            new: rotation.x,
            mid: scaffold_a_map.get(player)?.pitch?.new || 0,
            old: scaffold_a_map.get(player)?.pitch?.mid || 0
        },
        yaw: {
            new: rotation.y,
            mid: scaffold_a_map.get(player)?.yaw?.new || 0,
            old: scaffold_a_map.get(player)?.yaw?.mid || 0
        }
    });
}
