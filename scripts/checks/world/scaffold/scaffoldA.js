import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getAverageDifference, getDistanceXZ, getSpeed } from "../../../utils/maths/mathUtil.js";
import { fastAbs, fastHypot } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";

// Thank you Visual1mpact for helping me with the Map's
// Initialize scaffold_a_map if not present
const scaffold_a_map = new Map();

function is_diag_recode(neww, player, old) {
    const dx = neww.x - old.x;
    const dz = neww.z - old.z;
    return (
        (isomath.abs(neww.x) ^ isomath.abs(old.x)) &&
        (isomath.abs(neww.z) ^ isomath.abs(old.z)) &&
        ((dx * dx) < 4) &&
        ((dz * dz) < 4) &&
        (neww.y < player.location.y) &&
        (old.y === neww.y)
    );
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
    
    return fastHypot(dx, dz);
}
function isAirBelowAllBlocks(player, one, two, three) {
    const dimension = player.dimension;
    return (
        dimension.getBlock({ x: one.x, y: one.y - 1, z: one.z }).typeId === "minecraft:air" &&
        dimension.getBlock({ x: two.x, y: two.y - 1, z: two.z }).typeId === "minecraft:air" &&
        dimension.getBlock({ x: three.x, y: three.y - 1, z: three.z }).typeId === "minecraft:air"
    );
}

export function scaffold_a(player, block) {
    if(!allowedPlatform(player, config.modules.scaffoldA.AP)) return;
    
    if (config.modules.scaffoldA.enabled && scaffold_a_map.has(player.name) && !player.hasTag("gmc") && !player.hasTag("op")) {
        const place_location = { x: block.location.x, y: block.location.y, z: block.location.z };
        const last_place_location = scaffold_a_map.get(player.name)?.a;
        const old_place_location = scaffold_a_map.get(player.name)?.b;
        const pitch_values = scaffold_a_map.get(player.name)?.pitch;
        const yaw_values = scaffold_a_map.get(player.name)?.yaw;
        const distance = getDistanceXZ(player, block);
        if (last_place_location && old_place_location && pitch_values) {
            const xDist = isomath.abs(place_location.x) - isomath.abs(last_place_location.x);
            const zDist = isomath.abs(place_location.z) - isomath.abs(last_place_location.z);
            const isSameX = xDist === 0 && xDist === isomath.abs(old_place_location.x);
            const isSameZ = zDist === 0 && zDist === isomath.abs(old_place_location.z);

            if (isSameX || isSameZ) {
                const isPitchChange = isomath.abs(pitch_values.new - pitch_values.mid) > 0.05 &&
                                       isomath.abs(pitch_values.mid - pitch_values.old) > 0.05;
                const isYawSame = isomath.abs(yaw_values.new - yaw_values.mid) === 0 &&
                                  isomath.abs(yaw_values.mid - yaw_values.old) === 0;

                if (isPitchChange && isYawSame) {
                    flag(player, "Scaffold", "A", "World", "yaw(1)", player.getRotation().y, false);
                }
            }
            if (
                is_diag_recode(place_location, player, old_place_location) &&
                isAirBelowAllBlocks(player, place_location, last_place_location, old_place_location)
            ) {
                
                const isPitchEqual = isomath.abs(pitch_values.new - pitch_values.mid) === 0
                                    && isomath.abs(pitch_values.new - pitch_values.old) === 0;
                const isYawEqual = isomath.abs(yaw_values.new - yaw_values.mid) === 0
                                 && isomath.abs(yaw_values.new - yaw_values.old) === 0;
                const arePitchAndYawDifferent = isomath.abs(pitch_values.new - pitch_values.mid) !== 0 
                                           && isomath.abs(yaw_values.new - yaw_values.mid) !== 0;
                const isDiagonalConditionMet = isPitchEqual && isYawEqual ||
                                              isYawEqual && isPitchEqual && arePitchAndYawDifferent;
                if (isDiagonalConditionMet && getSpeed(player) > 0.3) {
                    if(!player.isSneaking) {
                        flag(player, "Scaffold", "A", "World", "no-rot-diff", "true", false);
                    }
                }
                const rotx = player.getRotation().x;

                const diff_1 = isomath.abs(yaw_values.mid - yaw_values.new);   
                const diff_2 = isomath.abs(yaw_values.new - player.getRotation().y);
                if(diff_2 < 10 && diff_1 < 10 && !is_decrease(player, place_location, last_place_location, old_place_location) && diff_1 > 0.5 && diff_2 > 0.5 && diff_1 != 0 && diff_2 != 0 && !config.modules.scaffoldA.nofalse && getSpeed(player) > 0.1 && (!player.isOnGround || diff_1 > 5 || diff_2 > 5)) {
                    flag(player, "Scaffold", "A", "World", "Yaw Diff (2)", (diff_1 + diff_2) / 2, false);
                }
                if(rotx < 44.5 && pitch_values.mid < 44.5 && distance < 1) {
                    flag(player, "Scaffold", "A", "World", "Pitch(1)", pitch_values.new, false);
                } 
                if(getSpeed(player) > 1) {
                    flag(player, "Scaffold", "A", "World", "Speed", getSpeed(player), true);
                }
                if(getAverageDifference([pitch_values.new, pitch_values.mid, pitch_values.old]) < 0.5 && distance < 1.5 && getAverageDifference([yaw_values.new, yaw_values.mid, yaw_values.old]) > 5 && getAverageDifference([pitch_values.new, pitch_values.mid, pitch_values.old]) >= 0) {
                    flag(player, "Scaffold", "A", "World", "Pitch(2)", getAverageDifference([pitch_values.new, pitch_values.mid, pitch_values.old]), false);
                }
            }
            
        }
    }
    const rotation = player.getRotation();
    scaffold_a_map.set(player.name, {
        a: { x: block.location.x, y: block.location.y, z: block.location.z },
        b: scaffold_a_map.get(player.name)?.a || { x: 0, y: 0, z: 0 },
        pitch: {
            new: rotation.x,
            mid: scaffold_a_map.get(player.name)?.pitch?.new || 0,
            old: scaffold_a_map.get(player.name)?.pitch?.mid || 0
        },
        yaw: {
            new: rotation.y,
            mid: scaffold_a_map.get(player.name)?.yaw?.new || 0,
            old: scaffold_a_map.get(player.name)?.yaw?.mid || 0
        }
    });
}
