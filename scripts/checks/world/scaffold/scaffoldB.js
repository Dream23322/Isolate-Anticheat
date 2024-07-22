import { flag } from "../../../util";
import config from "../../../data/config.js";

export function scaffold_b(player, block) {
    const rotation = player.getRotation();
    const velocity = player.getVelocity();

    const isValidRotation = config.modules.scaffoldB.enabled &&
        (rotation.x === 60 || rotation.x === -85);
    const isValidPlacement = !player.isGliding &&
        Math.hypot(velocity.x, velocity.z) > 0.2 &&
        block.location.y < player.location.y &&
        ((rotation.x % 1 === 0 ||
        (rotation.y % 1 === 0 && Math.abs(rotation.y) !== 90) ||
        (rotation.x % 5 === 0 ||
        (rotation.y % 5 === 0 && Math.abs(rotation.y) !== 90))) &&
        rotation.x !== 0 && rotation.y !== 0);

    if (isValidRotation || isValidPlacement) {
        flag(player, "Scaffold", "B", isValidRotation ? "World" : "Placement", 
            isValidRotation ? "rotation" : "rotation-y%1", rotation.x, true);
    }
}
