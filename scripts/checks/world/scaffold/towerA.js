import { flag } from "../../../util";
import config from "../../../data/config.js";
import { fastFloor } from "../../../utils/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function tower_a(player, block) {
    if(!allowedPlatform(player, config.modules.towerA.AP)) return;
    const rotation = player.getRotation()
    // Tower/A = Checks for 90 degree rotation
    if(config.modules.towerA.enabled) {
        // get block under player
        const blockUnder = player.dimension.getBlock({x: fastFloor(player.location.x), y: fastFloor(player.location.y) - 1, z: fastFloor(player.location.z)});
        if(rotation.x === 90 && blockUnder.location.x === block.location.x && blockUnder.location.z === block.location.z) {
            flag(player, "Tower", "A", "Placement", "xRot", "90", true);
        }
    }
}