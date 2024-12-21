import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";

export function scaffold_b(player, block) {
    if(!allowedPlatform(player, config.modules.scaffoldB.AP)) return;
    const rotation = player.getRotation();
    const velocity = player.getVelocity();

    const isValidRotation = config.modules.scaffoldB.enabled &&
        (rotation.x === 60 || rotation.x === -85);
    const isValidPlacement = !player.isGliding &&
        isomath.pythag(velocity.x, velocity.z) > 0.2 &&
        block.location.y < player.location.y &&
        ((rotation.x % 1 === 0 ||
        (rotation.y % 1 === 0 && isomath.abs(rotation.y) !== 90) ||
        (rotation.x % 5 === 0 ||
        (rotation.y % 5 === 0 && isomath.abs(rotation.y) !== 90))) &&
        rotation.x !== 0 && rotation.y !== 0) &&
        config.modules.scaffoldB.enabled;

    if (isValidRotation || isValidPlacement) {
        flag(player, "Scaffold", "B", isValidRotation ? "World" : "Placement", 
            isValidRotation ? "rotation" : "rotation-y%1", rotation.x, true);
    }
}
