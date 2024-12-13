import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";

export function tower_a(player, block) {
    if(!allowedPlatform(player, config.modules.towerA.AP)) return;
    const rotation = player.getRotation()
    // Tower/A = Checks for 90 degree rotation
    if(config.modules.towerA.enabled) {
        // get block under player
        const blockUnder = player.dimension.getBlock({x: isomath.floor(player.location.x), y: isomath.floor(player.location.y) - 1, z: isomath.floor(player.location.z)});
        if(rotation.x === 90 && blockUnder.location.x === block.location.x && blockUnder.location.z === block.location.z) {
            flag(player, "Tower", "A", "Placement", "xRot", "90", true);
        }
    }
}