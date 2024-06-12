import { flag } from "../../../util";
import config from "../../../data/config.js";

export function tower_a(player, block) {
    const rotation = player.getRotation()
    // Tower/A = Checks for 90 degree rotation
    if(config.modules.towerA.enabled) {
        // get block under player
        const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
        if(rotation.x === 90 && blockUnder.location.x === block.location.x && blockUnder.location.z === block.location.z) {
            flag(player, "Tower", "A", "Placement", "xRot", "90", true);
        }
    }
}